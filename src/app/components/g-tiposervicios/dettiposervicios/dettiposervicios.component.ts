import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Tipoanimal } from 'src/app/model/tipoanimal.model';
import { Tiposervicios } from 'src/app/model/tiposervicios.model';
import { AnimalesService } from 'src/app/service/animales.service';
import { TiposerviciosService } from 'src/app/service/tiposervicios.service';

@Component({
  selector: 'app-dettiposervicios',
  templateUrl: './dettiposervicios.component.html',
  styleUrls: ['./dettiposervicios.component.css']
})
export class DettiposerviciosComponent implements OnInit {

  form        : FormGroup;
  pageActual  : number = 1 ;
  submitted = false;
  index = 0;
  tipsI       : Tiposervicios;
  tipoanimalI: Tipoanimal;
  apiTiposervicios : any;
  apiTipoanimal: any;
  

  modalReference: NgbModalRef;  //para mensaje

  constructor(
    private modalService : NgbModal,
    private formBuilder  : FormBuilder,
    private tipsS        : TiposerviciosService,
    private aniS         : AnimalesService
  ) { 
    this.tipsS.getTiposerviciosLista().subscribe( respon=>{
      this.apiTiposervicios = respon;
    });
    this.aniS.getTipoAnimalesLista().subscribe(respo =>{
      this.apiTipoanimal = respo;
    });
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nomser     :  ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30),]],
      preser     : ['', [Validators.required, Validators.min(0)]],
      desser     : ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100),]],
      tipoanimal  : ['', [Validators.required]],
      
    });
  }

  get f(){ return this.form.controls; }

  listarTiposer(){
    this.tipsS.getTiposerviciosLista().subscribe( respon=>{
      this.apiTiposervicios = respon;
    });
  }

  
  llamaModalMod( modal, tips : Tiposervicios){
    this.submitted = false;
    this.form.reset({ nomser : tips.nomser, preser: tips.preser, desser: tips.desser, tipoanimal: tips.tipoanimal.idtip});
    this.modalReference = this.modalService.open(modal, { centered: true });  
    this.index = tips.idtipser; 
  }

  onSubmit(){
    this.submitted = true;
    if ((this.form.invalid) == true) {
       return;
    }
    for (let i =  0; i < this.apiTipoanimal.length; i++) {
      if (this.form.controls.tipoanimal.value == this.apiTipoanimal[i].idtip) {
        this.tipoanimalI = this.apiTipoanimal[i];
      }
    }
    this.tipsI = {

      idtipser  : 0,
      nomser    : (this.form.controls.nomser.value).toUpperCase(),
      preser    : (this.form.controls.preser.value),
      desser    : (this.form.controls.desser.value).toUpperCase(),
      estado    : 1,
      tipoanimal: this.tipoanimalI,

    }
    this.tipsS.modificarTiposervicios(this.index, this.tipsI).subscribe(response => {
    this.tipsS.getTiposerviciosLista().subscribe( respon=>{
      this.apiTiposervicios = respon;
    });
      },  
      error => {  
        console.log("error while saving data in the DB"); 
      }      
    ); 
    this.modalReference.close();  //para cerrar
  }

  llamaModalDel( modal, tips : Tiposervicios){
    this.modalReference = this.modalService.open(modal, { centered: true });  
    this.tipsI = tips;
  }

  onSubmitDel() {
    this.submitted = true; 
    this.tipsS.deleteTiposervicios(this.tipsI.idtipser).subscribe(  
      response => {
          console.log("Eliminacion logica correcta"); 
          // REFERESCA LA LISTA
          this.tipsS.getTiposerviciosLista().subscribe( respon=>{
            this.apiTiposervicios = respon;
          });
          
      },  
      error => {  
        console.log("Eror al modificar");  
      }      
    );  
    this.modalReference.close();  //para cerrar
  }
  
  llamaModalHab(modal, tips : Tiposervicios){
    //para que la ventana modal se cierre
    this.modalReference = this.modalService.open(modal, { centered: true });  
    this.tipsI = tips;
  }
  
  onSubmitHab() {
  this.submitted = true; 
  this.tipsS.habilitarTiposervicios(this.tipsI.idtipser).subscribe(  
    response => {
        console.log("Habilitacion correcta"); 
        // REFERESCA LA LISTA
        this.tipsS.getTiposerviciosLista().subscribe( respon=>{
          this.apiTiposervicios = respon;
        });
        
    },  
    error => {  
      console.log("Eror al modificar");  
    }      
  );  
  this.modalReference.close();  //para cerrar
  }


  //Filtro
  onChangeFiltroNombres(xnomser: string, xidtip: number, xestado: number): void {
    this.tipsS.listaTipsNom(xnomser, xidtip, xestado).subscribe( respo => {
        console.log(xestado + ' entro');
        this.apiTiposervicios = respo;
      },
      error => {
        console.error('Error al obtener tipos de servicios:', error);
      }
    );
  }

}
