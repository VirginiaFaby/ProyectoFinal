import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Granjas } from 'src/app/model/granjas.model';
import { Departamentos, Municipios, Provincias } from 'src/app/model/guiasenasag.model';
import { Tipoanimal } from 'src/app/model/tipoanimal.model';
import { AnimalesService } from 'src/app/service/animales.service';
import { GranjasService } from 'src/app/service/granjas.service';
import { GuiasenasagService } from 'src/app/service/guiasenasag.service';

@Component({
  selector: 'app-detgranjas',
  templateUrl: './detgranjas.component.html',
  styleUrls: ['./detgranjas.component.css']
})
export class DetgranjasComponent implements OnInit {

  form        : FormGroup;
  pageActual  : number = 1 ;
  submitted = false;
  index = 0;
  graI: Granjas;
  tipoanimalI    : Tipoanimal;
  departamentosI : Departamentos;
  provinciasI    : Provincias;
  municipiosI    : Municipios;
  
  apiGranjas       : any;
  apiDepartamentos : any; 
  apiProvincias    : any;
  apiMunicipios    : any;
  apiTipoanimal    : any;

  apidepartamentos: any[];
  apiprovincias: any[];
  apimunicipios: any[];

  modalReference: NgbModalRef;  //para mensaje

  constructor(
    private modalService : NgbModal,
    private formBuilder  : FormBuilder,
    private graS         : GranjasService,
    private guiaS        : GuiasenasagService,
    private aniS         : AnimalesService,
  ) {
    this.graS.getGranjasLista().subscribe(repon=>{
      this.apiGranjas = repon;
    });
    this.guiaS.getDepartamentoslista().subscribe(resp =>{
      this.apiDepartamentos = resp;
    });
    this.guiaS.getProvinciasLista().subscribe(resp =>{
      this.apiProvincias = resp;
    });
    this.guiaS.getMunicipioslista().subscribe(resp =>{
      this.apiMunicipios = resp;
    });
    this.aniS.getTipoAnimalesLista().subscribe((respo) => {
      this.apiTipoanimal = respo;
    });

   }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      codigo     :  ['', [Validators.required, Validators.min(0), Validators.pattern(/^[1-9]\d{6,7}$/)    ]],
      nomgra     : ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
      progra     : ['', [Validators.required, Validators.minLength(7), Validators.maxLength(30), Validators.pattern('^[a-zA-Z ]+$')]],
      telegra    : ['', [Validators.required, Validators.min(0), Validators.pattern(/^[67]\d{7,8}$/)]],
      correogra  : ['', [Validators.required, Validators.email]],
      departamentos  : ['', [Validators.required]],
      provincias  : ['', [Validators.required]],
      municipios  : ['', [Validators.required]],
      tipoanimal  : ['', [Validators.required]],
    });

    this.guiaS.getDepartamentoslistas().subscribe((data: any[]) => {
      this.apidepartamentos = data; // Asigna los datos a apidepartamentos
      //console.log(this.apidepartamentos); // Verifica los datos aquí
    });
    this.guiaS.getProvinciasListas().subscribe((data: Provincias[]) => {
      this.apiprovincias = data; // Asigna los datos a apiprovincias
      //console.log(this.apiprovincias); // Verifica los datos aquí
    });
  }


  get f(){ return this.form.controls; }

  listarGranjas(){
    this.graS.getGranjasLista().subscribe(repon=>{
      this.apiGranjas = repon;
    });    
  }
  cargarProvincias() {
    const departamentoId = this.form.get('departamentos').value;
    this.guiaS.listarProvinciasPorDepartamento(departamentoId).subscribe(response => {
      this.apiProvincias = response;
      // Limpia la selección de provincia y municipio
      this.form.get('provincias').setValue('');
      this.form.get('municipios').setValue('');
    });
  }

  cargarMunicipios() {
    const provinciaId = this.form.get('provincias').value;
    this.guiaS.listarMunicipiosPorProvincia(provinciaId).subscribe(response => {
      this.apiMunicipios = response;
    });
  }


  llamaModalMod(modal, gra : Granjas){
    this.submitted = false;
    this.form.reset({codigo: gra.codigo, nomgra: gra.nomgra, progra: gra.progra, telegra: gra.telegra, 
      correogra: gra.correogra, departamentos : gra.departamentos.iddep, provincias: gra.provincias.idprovin,
      municipios: gra.municipios.idmun , tipoanimal: gra.tipoanimal.idtip
    });
    this.modalReference = this.modalService.open(modal, { centered: true });  
    this.index = gra.idgranja; 
  }

  onSubmit(){
    this.submitted = true;
    if ((this.form.invalid) == true) {
       return;
    }
    for(let i=0; i<this.apiDepartamentos.length; i++){
      if(this.form.controls.departamentos.value == this.apiDepartamentos[i].iddep){
        this.departamentosI = this.apiDepartamentos[i]; 
      }
    }
    for(let i=0; i<this.apiProvincias.length; i++){
      if(this.form.controls.provincias.value == this.apiProvincias[i].idprovin){
        this.provinciasI = this.apiProvincias[i]; 
      }
    }
    for(let i=0; i<this.apiMunicipios.length; i++){
      if(this.form.controls.municipios.value == this.apiMunicipios[i].idmun){
        this.municipiosI = this.apiMunicipios[i]; 
      }
    }
    for (let i =  0; i < this.apiTipoanimal.length; i++) {
      if (this.form.controls.tipoanimal.value == this.apiTipoanimal[i].idtip) {
        this.tipoanimalI = this.apiTipoanimal[i];
      }
    }
    
    this.graI = {
      idgranja : 0,
      codigo : (this.form.controls.codigo.value),
      nomgra : (this.form.controls.nomgra.value).toUpperCase(),
      progra : (this.form.controls.progra.value).toUpperCase(),
      telegra : (this.form.controls.telegra.value),
      correogra : (this.form.controls.correogra.value),
      estado : 1,
      departamentos   : this.departamentosI,
      provincias      : this.provinciasI,
      municipios      : this.municipiosI,
      tipoanimal      : this.tipoanimalI,
    }
    this.graS.modificarGranjas(this.index, this.graI).subscribe(response => {
      this.graS.getGranjasLista().subscribe( respon=>{
        this.apiGranjas = respon;
      });
      },  
      error => {  
        console.log("error while saving data in the DB"); 
      }      
    ); 
    this.modalReference.close();  //para cerrar

  }

  llamaModalDel( modal, gra : Granjas){
    this.modalReference = this.modalService.open(modal, { centered: true });  
    this.graI = gra;
  }

  onSubmitDel() {
    this.submitted = true; 
    this.graS.deleteGranjas(this.graI.idgranja).subscribe(  
      response => {
          console.log("Eliminacion logica correcta"); 
          // REFERESCA LA LISTA
          this.graS.getGranjasLista().subscribe( respon=>{
            this.apiGranjas = respon;
          });
          
      },  
      error => {  
        console.log("Eror al modificar");  
      }      
    );  
    this.modalReference.close();  //para cerrar
  }
  
  llamaModalHab(modal, gra : Granjas){
    //para que la ventana modal se cierre
    this.modalReference = this.modalService.open(modal, { centered: true });  
    this.graI = gra;
  }
  
  onSubmitHab() {
  this.submitted = true; 
  this.graS.habilitarGranjas(this.graI.idgranja).subscribe(  
    response => {
        console.log("Habilitacion correcta"); 
        // REFERESCA LA LISTA
        this.graS.getGranjasLista().subscribe( respon=>{
          this.apiGranjas = respon;
        });
        
    },  
    error => {  
      console.log("Eror al modificar");  
    }      
  );  
  this.modalReference.close();  //para cerrar
  }

  //Filtro


  onChangeFiltroNombre(xnomgra: string, xidtip: number, xestado: number): void {
    this.graS.listaGranjasNom(xnomgra, xidtip, xestado).subscribe( respo => {
        console.log(xestado + ' entro');
        this.apiGranjas = respo;
      },
      error => {
        console.error('Error al obtener tipos de servicios:', error);
      }
    );
  }

}
