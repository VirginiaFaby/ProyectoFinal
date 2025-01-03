import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { Departamentos, Guiasenasag, Oficinalocal } from 'src/app/model/guiasenasag.model';
import { GuiasenasagService } from 'src/app/service/guiasenasag.service';
import { Granjas } from 'src/app/model/granjas.model';
import { Tiposervicios } from 'src/app/model/tiposervicios.model';
import { GranjasService } from 'src/app/service/granjas.service';
import { TiposerviciosService } from 'src/app/service/tiposervicios.service';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { Personas } from 'src/app/model/personas.model';
import { DatePipe } from '@angular/common';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-detguiasenasag',
  templateUrl: './detguiasenasag.component.html',
  styleUrls: ['./detguiasenasag.component.css']
})
export class DetguiasenasagComponent implements OnInit {

  
  form : FormGroup;
  index = 0;
  submitted = false;
  guiasenasagI: Guiasenasag;
  apiGuiasenasag : any;
  apiTiposervicios: any;
  apiDepartamentos: any;
  apiOficinalocal : any;
  apicorrales : any[];
  apiOficinasLocales : any[];
  errorMensaje: string = '';

  apiGranjas: any;
  granjasI : Granjas;
  tiposerviciosI: Tiposervicios;
  departamentosI: Departamentos;
  oficinalocalI: Oficinalocal;

  pageActual :number = 1

  granjaCtrl = new FormControl();
  filteredGranjas: any[] = []; // Lista de granjas filtradas
  mostrarListaGranjas = false; // Controla si mostrar la lista de sugerencias
  granjaSeleccionada: any; // Granja seleccionada
  interactuandoConListaGranjas = false; // Indica si el usuario está interactuando con la lista


  private _success  = new Subject<string>(); 
  staticAlertClosed = false;  
  successMessage    : string; 
  modalReference    : NgbModalRef;

  constructor(
    private modalService : NgbModal,
    private formBuilder : FormBuilder,
    private guiaS : GuiasenasagService,
    private graS : GranjasService,
    private tipserS : TiposerviciosService,
    private http: HttpClient,
    private datePipe: DatePipe // <--- Aquí
  
  ) { 
    this.granjaCtrl.valueChanges.subscribe(value => {
      if (value && value.length > 1) { // Filtra solo si hay más de un carácter
        this.filtrarGranjas(value);
      } else {
        this.filteredGranjas = [];
      }
    });

    this.guiaS.getGuiasenasagLista().subscribe(resp =>{
      this.apiGuiasenasag = resp;
    });
    this.graS.getGranjasLista().subscribe(respo =>{
      this.apiGranjas = respo;
    });
    this.tipserS.getTiposerviciosLista().subscribe(respo =>{
      this.apiTiposervicios = respo;
    });
    this.guiaS.getDepartamentoslista().subscribe(resp =>{
      this.apiDepartamentos = resp;
    });

    this.guiaS.getOficinaLocallista().subscribe(resp =>{
      this.apiOficinalocal = resp;
    });

 
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      feclle: ['', [Validators.required]],
      nroguia: ['', [Validators.required, Validators.min(0)]],
      tothem: ['', [Validators.required, Validators.min(0)]],
      totmac: ['', [Validators.required, Validators.min(0)]],
      totani: [{ value: '', disabled: true }, [Validators.required]],
      preguia: [{ value: 0, disabled: true }, [Validators.required]],
      ingguia: [{ value: '', disabled: true }, [Validators.required]],
      observaciones: [''],
      granjas: ['', [Validators.required]],
      tiposervicios: ['', [Validators.required]],
      departamentos: ['', [Validators.required]],
      oficinalocal: [''],

    });
/*
    this.corS.getCorralesListas().subscribe((data: Corrales[]) => {
      this.apicorrales = data; // Asigna los datos a apiprovincias
     //console.log(" " ,this.apicorrales); // Verifica los datos aquí
    });
    */
    this.guiaS.getOficinalocalListas().subscribe((data: Oficinalocal[]) => {
      this.apiOficinasLocales = data; // Asigna los datos a apiprovincias
      //console.log(this.apiOficinasLocales); // Verifica los datos aquí
    });

  }

  get f(){ return this.form.controls;}

  listarGuiasenasag(){
    this.guiaS.getGuiasenasagLista().subscribe(resp =>{
      this.apiGuiasenasag = resp;
    });
  }

  
  llamaModalMod(modal, guia: Guiasenasag) {
    this.submitted = false;
  
    // Inicializar valores del formulario con los datos del objeto `guia`
    this.form.reset({
      feclle: guia.feclle,
      nroguia: guia.nroguia,
      tothem: guia.tothem,
      totmac: guia.totmac,
      totani: guia.totani,
      preguia: guia.preguia,
      ingguia: guia.ingguia,
      observaciones: guia.observaciones,
      granjas: guia.granjas?.idgranja, // Asegurar que `granjas` tenga un valor válido
      tiposervicios: guia.tiposervicios?.idtipser,
      departamentos: guia.departamentos?.iddep,
      oficinalocal: guia.oficinalocal?.idofi
    });
  
    // Prellenar el buscador de granjas
    if (guia.granjas) {
      this.granjaSeleccionada = guia.granjas; // Guardar la granja seleccionada
      this.granjaCtrl.setValue(`${guia.granjas.nomgra} - ${guia.granjas.codigo}`); // Mostrar el nombre y código
    }
  
    // Abrir el modal
    this.modalReference = this.modalService.open(modal, { size: 'lg' });
  
    // Guardar el índice del elemento que se está editando
    this.index = guia.idguisen;
  }
  


  filtrarGranjas(filtro: string): void {
    this.guiaS.buscarGranjas(filtro).subscribe(granjas => {
      this.filteredGranjas = granjas; // Actualiza la lista de granjas filtradas
      this.mostrarListaGranjas = true; // Asegura que la lista se muestre después de filtrar
    });
  }

  seleccionarGranja(granja: any): void {
    this.granjaSeleccionada = granja; // Guarda la granja seleccionada
    this.form.controls['granjas'].setValue(granja.idgranja); // Asigna el ID al formulario
    this.granjaCtrl.setValue(`${granja.nomgra} - ${granja.codigo}`); // Muestra la granja seleccionada en el input
    this.mostrarListaGranjas = false; // Oculta la lista después de seleccionar una granja
  }


  
  
  /* Departamento y Oficina Local  */
  cargarOficinasLocales() {
    const departamentoId = this.form.get('departamentos').value;
    console.log( departamentoId);
    this.guiaS.listarOficinasLocalesPorDepartamento(departamentoId).subscribe(response => {
      this.apiOficinasLocales = response;
      this.form.get('oficinalocal').setValue('');
    });
  }

  /* sumas  */
  sumarTothem() {
    const eda6hem = this.form.controls.eda6hem.value || 0;
    const eda724hem = this.form.controls.eda724hem.value || 0;
    const eda24hem = this.form.controls.eda24hem.value || 0;
    const tothem = eda6hem + eda724hem + eda24hem;
    this.form.controls.tothem.setValue(tothem);
    this.sumarTotani();
    this.calcularIngguia();
 
  }

  sumarTotmac() {
    const eda6mac = this.form.controls.eda6mac.value || 0;
    const eda724mac = this.form.controls.eda724mac.value || 0;
    const eda24mac = this.form.controls.eda24mac.value || 0;
    const totmac = eda6mac + eda724mac + eda24mac;
    this.form.controls.totmac.setValue(totmac);
    this.sumarTotani();
    this.calcularIngguia();
  
  }

  sumarTotani() {
    const tothem = this.form.controls.tothem.value || 0;
    const totmac = this.form.controls.totmac.value || 0;
    const totani = tothem + totmac;
    this.form.controls.totani.setValue(totani);
    this.calcularIngguia();
  
  }

  /* Poner automaticamente el precio del servivio */
  ontiposerviciosChange() {
    const selectedTiposerviciosId = parseInt(this.form.get('tiposervicios').value, 10);    
    // Busca el servicio seleccionado en apiTiposervicios
    const selectedTiposervicios = this.apiTiposervicios.find(tips => tips.idtipser === selectedTiposerviciosId );
    
    if (selectedTiposervicios) {
      // Si se encuentra el servicio, establece el campo preves con el precio
      this.form.get('preguia').setValue(selectedTiposervicios.preser);
    } else {
      // Si no se encuentra el servicio, puedes dejar el campo preguia vacío o realizar otra acción.
      this.form.get('preguia').setValue('');
    }
    this.calcularIngguia();
  }


  calcularIngguia(){
    const totani = this.form.controls.totani.value || 0;
    const preguia = this.form.controls.preguia.value || 0;
    const ingguia = totani * preguia;
    this.form.controls.ingguia.setValue(ingguia);
  }

  ///registro de animales 

  onSubmit(){
    this.submitted = true;
    if ((this.form.invalid) == true) {
       return;
    }
    for (let i=0; i<this.apiGranjas.length; i++){
      if (this.form.controls.granjas.value == this.apiGranjas[i].idgranja){
        this.granjasI = this.apiGranjas[i];
      }
    }
  
    for (let i=0; i<this.apiTiposervicios.length; i++){
      if (this.form.controls.tiposervicios.value == this.apiTiposervicios[i].idtipser){
        this.tiposerviciosI = this.apiTiposervicios[i];
      }
    }
    for(let i=0; i<this.apiDepartamentos.length; i++){
      if(this.form.controls.departamentos.value == this.apiDepartamentos[i].iddep){
        this.departamentosI = this.apiDepartamentos[i]; 
      }
    }

    for(let i=0; i<this.apiOficinalocal.length; i++){
      if(this.form.controls.oficinalocal.value == this.apiOficinalocal[i].idofi ){
        this.oficinalocalI = this.apiOficinalocal[i]; 
      }
    }
 

 
    this.guiasenasagI = {
      idguisen: 0,
      feclle: (this.form.controls.feclle.value).toUpperCase(),
      nroguia: (this.form.controls.nroguia.value),
      tothem: (this.form.controls.tothem.value),
      totmac: (this.form.controls.totmac.value),
      totani: (this.form.controls.totani.value),
      preguia:  (this.form.controls.preguia.value),
      ingguia: (this.form.controls.ingguia.value),
      observaciones: (this.form.controls.observaciones.value).toUpperCase(),
      guiani: 0,
      estado: 0,
      granjas: this.granjasI,
      tiposervicios: this.tiposerviciosI,
      departamentos: this.departamentosI,
      oficinalocal: this.oficinalocalI,
  

    }
    this.guiaS.modificarGuiasenasag(this.index, this.guiasenasagI).subscribe(response => {
      this.guiaS.getGuiasenasagLista().subscribe(resp =>{
        this.apiGuiasenasag = resp;
      });
      },  
      error => {  
        console.log("error while saving data in the DB"); 
      }      
    ); 
    this.modalReference.close();  //para cerrar
  }

  llamaModalDel(modal, guia : Guiasenasag){
    //para que la ventana modal se cierre
    this.modalReference = this.modalService.open(modal, { centered: true });  
    this.guiasenasagI = guia;
  }
  
  onSubmitDel() {
    this.submitted = true; 
    this .guiaS.deleteGuiasenasag(this.guiasenasagI.idguisen).subscribe(  
      response => {
          console.log("Eliminacion logica correcta"); 
          // REFERESCA LA LISTA
          this.guiaS.getGuiasenasagLista().subscribe(resp =>{
            this.apiGuiasenasag = resp;
          });  
      },  
      error => {  
        console.log("Eror al modificar");  
      }      
    );  
    this.modalReference.close();  //para cerrar
  }
  llamaModalVer(modal, guia : Guiasenasag){
    this.guiasenasagI = guia;
  // Abrir el modal
  this.modalReference = this.modalService.open(modal, { 
    size: 'lg', 
    centered: true // Esto asegura que el modal se centre en la pantalla
  });
  }

  createPdf() {
    const imagePath1 = 'assets/matadero.png';
    const imagePath2 = 'assets/descarga.jpg';
  
    forkJoin([
      this.http.get(imagePath1, { responseType: 'blob' }),
      this.http.get(imagePath2, { responseType: 'blob' })
    ]).subscribe(([blob1, blob2]) => {
      const reader1 = new FileReader();
      reader1.onloadend = () => {
        const imageDataURL1 = reader1.result as string;
  
        const reader2 = new FileReader();
        reader2.onloadend = () => {
          const imageDataURL2 = reader2.result as string;
  
          // Obtener datos dinámicos
          const feclle = this.guiasenasagI.feclle ? new Date(this.guiasenasagI.feclle).toLocaleDateString() : '';
          const nroguia = this.guiasenasagI.nroguia || '';
          const nomgra = this.guiasenasagI.granjas.nomgra || '';
          const codigo = this.guiasenasagI.granjas.codigo || '';
          const totani = this.guiasenasagI.totani || 0;
          const preguia = this.guiasenasagI.preguia || 0;
          const ingguia = this.guiasenasagI.ingguia || 0;
          const nomser = this.guiasenasagI.tiposervicios.nomser || '';
  
          // Convertir monto total a letras
          const numberToWords = (num: number): string => {
            const integerPart = Math.floor(num);
            const decimalPart = Math.round((num - integerPart) * 100);
            const integerWords = integerPart.toLocaleString('es-BO', { style: 'decimal' });
            return `SON: ${integerWords} ${decimalPart}/100 bolivianos`.toUpperCase();
          };
          const montoEnLetras = numberToWords(ingguia);
  
          // Crear tabla dinámica
          const detallePesajes = [
            [
              { text: totani.toString(), alignment: 'center' },
              { text: `${nomser} DE LA GUÍA Nº ${nroguia}`, alignment: 'left' },
              { text: preguia.toFixed(2), alignment: 'center' },
              { text: ingguia.toFixed(2), alignment: 'center' }
            ]
          ];
  
          // Crear PDF
          const pdfDefinition = {
            content: [
              {
                columns: [
                  {
                    width: 55,
                    image: imageDataURL2,
                    fit: [55, 55],
                    alignment: 'left',
                    margin: [10, 15, 0, 0]
                  },
                  {
                    width: '*',
                    stack: [
                      { text: '\n\nENTIDAD DESCENTRALIZADA\n', style: 'title', alignment: 'center' },
                      { text: '“MATADERO FRIGORÍFICO MUNICIPAL DE TARIJA”\n\n', style: 'subTitle', alignment: 'center' },
                      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 455, y2: 0, lineWidth: 2, lineColor: 'red' }] },
                      { text: '\n' },
                      { text: 'PESAJE DE ANIMALES', style: 'title', alignment: 'center' },
                      { text: '\n' },
                      { text: `FECHA: ${feclle}`, style: 'text', alignment: 'left' },
                      {
                        columns: [
                          { text: `GRANJA: ${nomgra}`, style: 'text', alignment: 'left' },
                          { text: `CÓDIGO: ${codigo}`, style: 'text', alignment: 'right' }
                        ],
                        margin: [0, 5, 0, 5]
                      },
                      { text: '\n' },
  
                      // Tabla de detalles de pesajes
                      {
                        table: {
                          headerRows: 1,
                          widths: ['auto', '*', 'auto', 'auto'],
                          body: [
                            [
                              { text: 'CANT.', style: 'tableHeader', alignment: 'center' },
                              { text: 'DESCRIPCIÓN', style: 'tableHeader', alignment: 'center' },
                              { text: 'P.UNIT.', style: 'tableHeader', alignment: 'center' },
                              { text: 'SUBTOTAL', style: 'tableHeader', alignment: 'center' }
                            ],
                            ...detallePesajes
                          ]
                        },
                        layout: 'lightHorizontalLines',
                        margin: [0, 0, 0, 10]
                      },
  
                      // Total del servicio
                      {
                        table: {
                          headerRows: 0,
                          widths: ['*', 'auto'],
                          body: [
                            [
                              { text: 'TOTAL', alignment: 'right', bold: true },
                              { text: ingguia.toFixed(2), alignment: 'center' }
                            ]
                          ]
                        },
                        layout: 'lightHorizontalLines',
                        margin: [0, -10, 15, 0]
                      },
  
                      // Monto en letras
                      {
                        text: montoEnLetras,
                        style: 'text',
                        alignment: 'left',
                        margin: [0, 10, 0, 0],
                        bold: true
                      }
                    ],
                    margin: [0, 0, 0, 10]
                  },
                  {
                    width: 55,
                    image: imageDataURL1,
                    fit: [55, 55],
                    alignment: 'right',
                    margin: [0, 15, 10, 0]
                  }
                ],
                margin: [0, 0, 0, 10]
              }
            ],
            pageSize: 'A4',
            pageMargins: [10, 10, 10, 10],
            styles: {
              header: { fontSize: 14, bold: true },
              text: { fontSize: 12 },
              tableHeader: { bold: true, fillColor: '#eeeeee' },
              title: { fontSize: 14, bold: true },
              subTitle: { fontSize: 12, bold: true, italics: true }
            }
          };
  
          // Crear y abrir el PDF
          const pdf = pdfMake.createPdf(pdfDefinition);
          pdf.open();
        };
        reader2.readAsDataURL(blob2);
      };
      reader1.readAsDataURL(blob1);
    });
  }
  

   
 //filtro


onChangeFiltroNombre(idgranja?: number, estado?: number) {
  this.guiaS.listagui(idgranja, estado).subscribe(response => {
    console.log(estado + "aqui");
    this.apiGuiasenasag = response;
  });
}






}
