import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { Animales} from 'src/app/model/animales.model';
import { Corrales } from 'src/app/model/corrales.model';
import { Guiasenasag } from 'src/app/model/guiasenasag.model';
import { Razas } from 'src/app/model/razas.model';
import { Tipoanimal } from 'src/app/model/tipoanimal.model';
import { AnimalesService } from 'src/app/service/animales.service';
import { CorralesService } from 'src/app/service/corrales.service';
import { GuiasenasagService } from 'src/app/service/guiasenasag.service';


@Component({
  selector: 'app-detanimales',
  templateUrl: './detanimales.component.html',
  styleUrls: ['./detanimales.component.css']
})
export class DetanimalesComponent implements OnInit {
  
  apiAnimales: any;
  apiGuiasenasag: any;
  apiTipoanimal: any;
  apiCorrales: any;

  apirazas : any[];
  apitipoanimal : any[];

  index = 0;
  submitted = false;
  form : FormGroup;
  animalesI: Animales;
  guiasenasagI: Guiasenasag;
  corralesI: Corrales;
  tipoanimalI: Tipoanimal;
  apiRazas : any;
  pageActual :number = 1;

  private _success = new Subject<string>(); //para mensaje
  staticAlertClosed = false;  //para mensaje
  successMessage: string;  //para mensaje
  modalReference: NgbModalRef;  //para mensaje
  razasI: Razas;

  constructor(
    private modalService    : NgbModal,
    private formBuilder     : FormBuilder,
    private aniS            : AnimalesService,
    private guiS            : GuiasenasagService,
    private corS            : CorralesService,
    private datePipe        : DatePipe,

  ) { 
    this.aniS.getAnimalesLista().subscribe(resp =>{
      this.apiAnimales = resp;
      
    });
    this.guiS.getGuiasenasagLista().subscribe(respo =>{
      this.apiGuiasenasag = respo;
    });
    this.aniS.getTipoAnimalesLista().subscribe(respo =>{
      this.apiTipoanimal = respo;
      this.cargarTipoanimal();
    });
    this.aniS.getRazasLista().subscribe( respo=>{
      this.apiRazas = respo;
    });
    this.corS.getCorralesLista().subscribe(respo => {
      this.apiCorrales = respo;
    });
  }

  ngOnInit(): void {

    this.form = this.formBuilder.group({ 
      feclleg     : ['', [Validators.required]],
      edadani     : ['', [Validators.required]],
      pesani      : ['', [Validators.required]],
      origenani   : ['', [Validators.required]],
      sexo        : ['', [Validators.required]],
      tipocs      : ['', [Validators.required]],
      guiasenasag : ['', [Validators.required]],
      tipoanimal  : ['', [Validators.required]],
      razas       : ['', [Validators.required]],
      corrales: ['', [Validators.required]],
    });
    this.aniS.getTipoanimallistas().subscribe((data: Tipoanimal[]) =>{
      this.apitipoanimal = data;
      this.cargarTipoanimal();
    });
    this.aniS.getRazaslistas().subscribe((data: Razas[]) =>{
      this.apirazas = data;
      //console.log(this.apirazas);
    });
  }
  get f() { return this.form.controls;}

  listarAnimal(){
    this.aniS.getAnimalesLista().subscribe(resp =>{
      this.apiAnimales = resp;
    });
  }

  cargarTipoanimal() {
    //console.log('La función cargarTipoanimal se ha llamado.');
    const tipoanimalId = this.form.get('tipoanimal').value;
    this.aniS.listarRazasPorTipoAnimal(tipoanimalId).subscribe(respo => {
      this.apiRazas = respo; // Usar una variable separada para las razas
    });
  }

  llamaModalMod(modal, ani : Animales){
    this.submitted = false;
    //inicializar valores del formulario
    this.form.reset({feclleg: ani.feclleg, edadani: ani.edadani,pesani: ani.pesani, origenani: ani.origenani, sexo: ani.sexo, 
    guiasenasag: ani.guiasenasag.idguisen, tipoanimal: ani.tipoanimal.idtip, razas: ani.razas.idraz,  corrales: ani.corrales.idcorral, tipocs : ani.tipocs});
    //para que la ventana modal se cierre
       // Abrir el modal centrado
    this.modalReference = this.modalService.open(modal, { 
      size: 'lg', 
      centered: true // Esto asegura que el modal se centre en la pantalla
    });
    this.index = ani.idani;
  }

  onSubmit(){
    this.submitted = true;
    if ((this.form.invalid) == true) {
       return;
    }
    for (let i=0; i<this.apiGuiasenasag.length; i++){
      if (this.form.controls.guiasenasag.value == this.apiGuiasenasag[i].idguisen){
        this.guiasenasagI = this.apiGuiasenasag[i];
      }
    }
    for (let i=0; i<this.apiTipoanimal.length; i++){
      if (this.form.controls.tipoanimal.value == this.apiTipoanimal[i].idtip){
        this.tipoanimalI = this.apiTipoanimal[i];
      }
    }
    for (let i=0; i<this.apiRazas.length; i++){
      if (this.form.controls.razas.value == this.apiRazas[i].idraz){
        this.razasI = this.apiRazas[i];
      }
    }
    for (let i = 0; i < this.apiCorrales.length; i++) {
      if (this.form.controls.corrales.value == this.apiCorrales[i].idcorral) {
        this.corralesI = this.apiCorrales[i];
      }
    }

    this.animalesI = {
      idani       : 0,
      feclleg     : (this.form.controls.feclleg.value),
      edadani     : (this.form.controls.edadani.value),
      pesani      : (this.form.controls.pesani.value),
      origenani   : (this.form.controls.origenani.value),
      sexo        : (this.form.controls.sexo.value),
      tipocs      : (this.form.controls.tipocs.value),
      canani      : 1,
      estado      : 1,
      guiasenasag : this.guiasenasagI,
      tipoanimal  : this.tipoanimalI,
      razas       : this.razasI,
      corrales: this.corralesI,
    }

    this.aniS.modificarAnimales(this.index, this.animalesI).subscribe(response => {
      this.aniS.getAnimalesLista().subscribe( response =>{
        this.apiAnimales = response;
      });
      },  
      error => {  
        console.log("error while saving data in the DB"); 
        //console.log('Valores del formulario antes de enviar la solicitud:', this.form.value);
      }      
    ); 
    this.modalReference.close();  //para cerrar
    
  }

  llamaModalDel(modal, ani : Animales){
    //para que la ventana modal se cierre
    this.modalReference = this.modalService.open(modal, { centered: true });
    this.animalesI = ani;
 }

 onSubmitDel() {
  this.submitted = true; 
  this.aniS.deleteAnimales(this.animalesI.idani).subscribe(  
    response => {
        console.log("Eliminacion logica correcta"); 
        // REFERESCA LA LISTA
        this.aniS.getAnimalesLista().subscribe( response =>{
          this.apiAnimales = response;
        });       
    },  
    error => {  
      console.log("Eror al modificar");  
    }      
  );  
  this.modalReference.close();  //para cerrar
}
//modal Habilitar 
llamaModalHab(modal, ani: Animales){
  //para que la ventana modal se cierre
  this.modalReference =  this.modalService.open(modal);
  this.apiAnimales = ani;
}

onSubmitHab() {
  this.submitted = true; 
  this.aniS.habilitarAnimales(this.animalesI.idani).subscribe(  
    response => {
        console.log("Habilitacion correcta"); 
        // REFERESCA LA LISTA
        this.aniS.getAnimalesLista().subscribe( response =>{
          this.apiAnimales = response;
        });
    },  
    error => {  
      console.log("Eror al modificar");  
    }      
  );  
  this.modalReference.close();  //para cerrar
  }

     //filtro
   onChangeFiltroNombre(xsexo : string, xestado : number){
    this.aniS.getCliListaRazsoc(xsexo, xestado).subscribe (response =>{
      console.log(xestado + "aqui");
      this.apiAnimales = response;
    });
  }

}

