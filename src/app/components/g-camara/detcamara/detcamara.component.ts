import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { Camara } from 'src/app/model/camara.model';
import { Tipoanimal } from 'src/app/model/tipoanimal.model';
import { AnimalesService } from 'src/app/service/animales.service';
import { CamaraService } from 'src/app/service/camara.service';

@Component({
  selector: 'app-detcamara',
  templateUrl: './detcamara.component.html',
  styleUrls: ['./detcamara.component.css']
})
export class DetcamaraComponent implements OnInit {

  form : FormGroup;
  apiCamara : any;
  camaraI : Camara;
  pageActual :number = 1;
  index = 0;
  submitted = false;
  tipoanimalI : Tipoanimal; 
  apiTipoanimal: any;

  private _success = new Subject<string>(); //para mensaje
  staticAlertClosed = false;  //para mensaje
  successMessage: string;  //para mensaje
  modalReference: NgbModalRef;  //para mensaje


  constructor(
    private modalService : NgbModal,
    private formBuilder  : FormBuilder,
    private camS         : CamaraService,
    private aniS :        AnimalesService,
  ) { 
    this.camS.getCamaraLista().subscribe( respon =>{
      this.apiCamara = respon;
    });
    this.aniS.getTipoAnimalesLista().subscribe((respo) => {
      this.apiTipoanimal = respo;
    });
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nomcam    : ['', [Validators.required]],
      capcam    : ['', [Validators.required]],
      temcam    : ['', [Validators.required]],
      unitem    : ['', [Validators.required]],
      tipoanimal: ['', [Validators.required]],
    });
  }

  get f(){ return this.form.controls; }

  llamaModalMod(modal, cam  : Camara){
    this.submitted = false;
    this.form.reset({nomcam: cam.nomcam, capcam : cam.capcam,temcam: cam.temcam, unitem : cam.unitem, tipoanimal: cam.tipoanimal.idtip });
    this.modalReference = this.modalService.open(modal, { centered: true }); 
    this.index = cam.idcamfri; 
  }

  listarCamara(){
    this.camS.getCamaraLista().subscribe( respon=>{
      this.apiCamara = respon;
    });
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
    this.camaraI= {
      idcamfri : 0,
      nomcam    : (this.form.controls.nomcam.value).toUpperCase(),
      capcam    : (this.form.controls.capcam.value),
      temcam    : (this.form.controls.temcam .value),
      unitem    : (this.form.controls.unitem.value),
      canting : 0,
      saldo   : 0,
      estado : 1,
      tipoanimal      : this.tipoanimalI,
    }
    this.camS.modificarCamara(this.index, this.camaraI).subscribe(response => {
      this.camS.getCamaraLista().subscribe( response =>{
        this.apiCamara = response;
        
      });
      },  
      error => {  
        console.log("error while saving data in the DB"); 
      }      
    ); 
    this.modalReference.close();  //para cerrar
    this._success.next(`Los Datos se GUARDARON Satisfactoriamente..!`);  //para mensaje
  }

  llamaModalDel(modal, cam : Camara){
    this.modalReference = this.modalService.open(modal, { centered: true }); 
    this.camaraI = cam;
  }

  onSubmitDel() {
    this.submitted = true; 
    this.camS.deleteCamara(this.camaraI.idcamfri).subscribe(  
      response => {
          console.log("Habilitacion correcta"); 
          // REFERESCA LA LISTA
          this.camS.getCamaraLista().subscribe( response =>{
            this.apiCamara = response;
          });
      },  
      error => {  
        console.log("Eror al modificar");  
      }      
    );  
    this.modalReference.close();  //para cerrar
    }
  

  llamaModalHab(modal, cam : Camara){
    //para que la ventana modal se cierre
    this.modalReference = this.modalService.open(modal, { centered: true }); 
    this.camaraI = cam;
  }
  
  onSubmitHab() {
  this.submitted = true; 
  console.log(this.camaraI.idcamfri);
  this.camS.habilitarCamara(this.camaraI.idcamfri).subscribe(  
    
    response => {
        console.log("Habilitacion correcta"); 
        // REFERESCA LA LISTA
        this.camS.getCamaraLista().subscribe( response =>{
          this.apiCamara = response;
        });    
    },  
    error => {  
      console.log("Eror al modificar");  
    }      
  );  
  this.modalReference.close();  //para cerrar
  }

   //filtro
   onChangeFiltroNombre(xnomcam:string, xestado : number){
    this.camS.getCamNomcam(xnomcam, xestado).subscribe (response =>{
      console.log(xestado + "aqui");
      this.apiCamara = response;
    });
  }


}
