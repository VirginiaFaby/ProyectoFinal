import { Component, OnInit, ViewChild } from '@angular/core';
import { DetgranjasComponent } from './detgranjas/detgranjas.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Granjas } from 'src/app/model/granjas.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GranjasService } from 'src/app/service/granjas.service';
import { Tipoanimal } from 'src/app/model/tipoanimal.model';
import { Departamentos, Municipios, Provincias } from 'src/app/model/guiasenasag.model';
import { AnimalesService } from 'src/app/service/animales.service';
import { GuiasenasagService } from 'src/app/service/guiasenasag.service';

@Component({
  selector: 'app-g-granjas',
  templateUrl: './g-granjas.component.html',
  styleUrls: ['./g-granjas.component.css']
})
export class GGranjasComponent implements OnInit {

  @ViewChild (DetgranjasComponent) detalleGranjas : DetgranjasComponent;

  form        : FormGroup;
  formFiltro  : FormGroup;
  submitted   = false;
  graI           : Granjas;
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
 
  modalReference: NgbModalRef;  

  constructor(
    private modalService : NgbModal,
    private formBuilder  : FormBuilder,
    private graS         : GranjasService,
    private aniS         : AnimalesService,
    private guiaS        : GuiasenasagService,
  ) { 
    this.aniS.getTipoAnimalesLista().subscribe((respo) => {
      this.apiTipoanimal = respo;
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
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      codigo     :  ['', [Validators.required, Validators.min(0), Validators.pattern(/^[1-9]\d{6,7}$/)    ]],
      nomgra     : ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
      progra     : ['', [Validators.required, Validators.minLength(7), Validators.maxLength(30), Validators.pattern('^[a-zA-Z ]+$')    ]],
      telegra    : ['', [Validators.required, Validators.min(0), Validators.pattern(/^[67]\d{7,8}$/)]],
      correogra  : ['', [Validators.email]],
      departamentos  : ['', [Validators.required]],
      provincias  : ['', [Validators.required]],
      municipios  : ['', [Validators.required]],
      tipoanimal  : ['', [Validators.required]],
    });

    this.formFiltro = this.formBuilder.group({
      filtro : [''],
      idtip  : ['-1'],
      estadosGra : ['-1', [Validators.required]]
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

  validarLongitudCodigo(control: FormControl) {
    const codigo = control.value;
    const longitud = codigo.toString().length;
    if (longitud !== 7) {
      return { longitudInvalida: true };
    }
    return null;
  }

  get f(){ return this.form.controls;}
  get f2() { return this.formFiltro.controls;}

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

  llamaModalAdd(modal){
    this.submitted = false;
    this.form.reset([{codigo : '', nomgra : '', progra : '', telegra : '', correogra: '',  
    departamentos: '', provincias: '', municipios: '',tipoanimal: ''}]);
    //para que la ventana modal se cierre
    this.modalReference = this.modalService.open(modal, { centered: true });   
  }



  filtrarNombre(): void {
    const filtro = this.formFiltro.value.filtro.toUpperCase();
    const idtip = this.formFiltro.value.idtip;
    const estadosGra = this.formFiltro.value.estadosGra;
    console.log("filtrar..");
    this.detalleGranjas.onChangeFiltroNombre(filtro, idtip, estadosGra);

    this.graS.listaGranjasNom(filtro, idtip, estadosGra). subscribe(respon =>{
      this.apiGranjas = respon;
    })
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
      idgranja        : 0,
      codigo          : (this.form.controls.codigo.value),
      nomgra          : (this.form.controls.nomgra.value).toUpperCase(),
      progra          : (this.form.controls.progra.value).toUpperCase(),
      telegra         : (this.form.controls.telegra.value),
      correogra       : (this.form.controls.correogra.value),
      estado          : 1,
      departamentos   : this.departamentosI,
      provincias      : this.provinciasI,
      municipios      : this.municipiosI,
      tipoanimal      : this.tipoanimalI,
    }
    this.graS.saveGranjas(this.graI).subscribe(response => {
      this.detalleGranjas.listarGranjas();
      },  
      error => {  
        console.log("error while saving data in the DB"); 
        
      }      
    ); 
    this.modalReference.close();  //para cerrar
    
  }


}
