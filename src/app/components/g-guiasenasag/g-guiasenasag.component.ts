import { Component, OnInit, ViewChild } from '@angular/core';
import { DetguiasenasagComponent } from './detguiasenasag/detguiasenasag.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Departamentos, Guiasenasag, Oficinalocal } from 'src/app/model/guiasenasag.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GuiasenasagService } from 'src/app/service/guiasenasag.service';
import { Granjas } from 'src/app/model/granjas.model';
import { GranjasService } from 'src/app/service/granjas.service';
import { Tiposervicios } from 'src/app/model/tiposervicios.model';
import { TiposerviciosService } from '../../service/tiposervicios.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { HttpClient } from '@angular/common/http';

import { Personas } from 'src/app/model/personas.model';
import { DatePipe } from '@angular/common';
pdfMake.vfs = pdfFonts.pdfMake.vfs;




@Component({
  selector: 'app-g-guiasenasag',
  templateUrl: './g-guiasenasag.component.html',
  styleUrls: ['./g-guiasenasag.component.css']
})
export class GGuiasenasagComponent implements OnInit {

  @ViewChild(DetguiasenasagComponent) detalleGuiasenasag: DetguiasenasagComponent

  form: FormGroup;
  formFiltro: FormGroup;
  submitted = false;
  modalReference: NgbModalRef;

  guiasenasagI: Guiasenasag;
  granjasI: Granjas;
  tiposerviciosI: Tiposervicios;
  departamentosI: Departamentos;
  oficinalocalI: Oficinalocal;

  apiGuiasenasag: any;
  apiTiposervicios: any;
  apiDepartamentos: any;
  apiOficinalocal: any;

  apiGranjas: any;

  apicorrales: any[];
  apiOficinasLocales: any[];
  personaLogueada: Personas | null = null;

  granjaCtrl = new FormControl();
  filteredGranjas: any[] = []; // Lista de granjas filtradas
  mostrarListaGranjas = false; // Controla si mostrar la lista de sugerencias
  granjaSeleccionada: any; // Granja seleccionada
  interactuandoConListaGranjas = false; // Indica si el usuario está interactuando con la lista



  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private guiaS: GuiasenasagService,
    private graS: GranjasService,
    private tipserS: TiposerviciosService,
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


    this.graS.getGranjasLista().subscribe(respo => {
      this.apiGranjas = respo;
    });
    this.tipserS.getTiposerviciosLista().subscribe(respo => {
      this.apiTiposervicios = respo;
    });
    this.guiaS.getDepartamentoslista().subscribe(resp => {
      this.apiDepartamentos = resp;
    });

    this.guiaS.getOficinaLocallista().subscribe(resp => {
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
    this.formFiltro = this.formBuilder.group({
      idgranja: [null],
      estadosGuia: ['-1', [Validators.required]]
    });

    this.guiaS.getOficinalocalListas().subscribe((data: Oficinalocal[]) => {
      this.apiOficinasLocales = data; // Asigna los datos a apiprovincias
      //console.log(this.apiOficinasLocales); // Verifica los datos aquí
    });
  }

  get f() { return this.form.controls; }
  get f2() { return this.formFiltro.controls; }

  llamaModalAdd(modal: any) {
    this.submitted = false;
    const fechaActual = new Date();
    const fechaFormateada = this.datePipe.transform(fechaActual, 'yyyy-MM-dd'); // Formato de fecha
  
    // Reiniciar el formulario con valores vacíos
    this.form.reset({
      idguisen: '', feclle: fechaFormateada, nroguia: '', tothem: '',totmac: '', totani: '', preguia: '', ingguia: '', observaciones: '', granjas: '', tiposervicios: '',
      departamentos: '', oficinalocal: ''
    });
  
    // Limpiar datos de búsqueda y selección
    this.granjaCtrl.setValue(''); // Limpia el input de búsqueda
    this.filteredGranjas = []; // Limpia la lista filtrada
    this.granjaSeleccionada = null; // Limpia la selección de la granja
    this.granjasI = null; // Limpia la referencia de la granja seleccionada
  
    // Abre el modal
    this.modalReference = this.modalService.open(modal, { size: 'lg' });
  }
  

  filtrarNombre(): void {
    const idgranja = this.formFiltro.value.idgranja;
    const estadosGuia = this.formFiltro.value.estadosGuia;
    console.log("filtrar..", idgranja, estadosGuia);
    this.detalleGuiasenasag.onChangeFiltroNombre(idgranja, estadosGuia);
    this.guiaS.listagui(idgranja, estadosGuia).subscribe(respon => {
      this.apiGuiasenasag = respon;
    })
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

  ocultarListaGranjas(): void {
    if (!this.interactuandoConListaGranjas) {
      // Solo oculta la lista si no se está interactuando con ella
      this.mostrarListaGranjas = false;
    }
  }

  /* Departamento y Oficina Local  */
  cargarOficinasLocales() {
    const departamentoId = this.form.get('departamentos').value;
    console.log(departamentoId);
    this.guiaS.listarOficinasLocalesPorDepartamento(departamentoId).subscribe(response => {
      this.apiOficinasLocales = response;
      this.form.get('oficinalocal').setValue('');
    });
  }

  /* sumas  */


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
    const selectedTiposervicios = this.apiTiposervicios.find(tips => tips.idtipser === selectedTiposerviciosId);

    if (selectedTiposervicios) {
      // Si se encuentra el servicio, establece el campo preves con el precio
      this.form.get('preguia').setValue(selectedTiposervicios.preser);
    } else {
      // Si no se encuentra el servicio, puedes dejar el campo preguia vacío o realizar otra acción.
      this.form.get('preguia').setValue('');
    }
    this.calcularIngguia();
  }


  calcularIngguia() {
    const totani = this.form.controls.totani.value || 0;
    const preguia = this.form.controls.preguia.value || 0;
    const ingguia = totani * preguia;
    this.form.controls.ingguia.setValue(ingguia);
  }


  /* Adicionar  */
  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    for (let i = 0; i < this.apiGranjas.length; i++) {
      if (this.form.controls.granjas.value == this.apiGranjas[i].idgranja) {
        this.granjasI = this.apiGranjas[i];
      }
    }

    for (let i = 0; i < this.apiTiposervicios.length; i++) {
      if (this.form.controls.tiposervicios.value == this.apiTiposervicios[i].idtipser) {
        this.tiposerviciosI = this.apiTiposervicios[i];
      }
    }
    for (let i = 0; i < this.apiDepartamentos.length; i++) {
      if (this.form.controls.departamentos.value == this.apiDepartamentos[i].iddep) {
        this.departamentosI = this.apiDepartamentos[i];
      }
    }

    for (let i = 0; i < this.apiOficinalocal.length; i++) {
      if (this.form.controls.oficinalocal.value == this.apiOficinalocal[i].idofi) {
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
      preguia: (this.form.controls.preguia.value),
      ingguia: (this.form.controls.ingguia.value),
      observaciones: (this.form.controls.observaciones.value).toUpperCase(),
      guiani: 0,
      estado: 0,
      granjas: this.granjasI,
      tiposervicios: this.tiposerviciosI,
      departamentos: this.departamentosI,
      oficinalocal: this.oficinalocalI,
    }

    this.guiaS.saveGuiasenasag(this.guiasenasagI).subscribe(
      response => {
        console.log("Datos guardados satisfactoriamente", response);
        this.detalleGuiasenasag.listarGuiasenasag();

      },
      error => {
        console.log("Error al guardar datos en la base de datos", error);
        //alert("Error No se Pudo Guarda")
        this.formFiltro.controls.idgranja.setValue(null);
        this.formFiltro.controls.estadosGuia.setValue('-1');
        this.detalleGuiasenasag.onChangeFiltroNombre(null, -1);
      }
    );

    this.modalReference.close();  // Para cerrar

  }

}
