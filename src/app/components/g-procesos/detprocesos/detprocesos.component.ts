import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Subject } from 'rxjs';
import { Procesos } from 'src/app/model/procesos.model';
import { ProcesosService } from 'src/app/service/procesos.service';

@Component({
  selector: 'app-detprocesos',
  templateUrl: './detprocesos.component.html',
  styleUrls: ['./detprocesos.component.css']
})
export class DetprocesosComponent implements OnInit {

  apiProcesos : any;
  index = 0;
  submitted = false;
  formMod : FormGroup;
  form : FormGroup;
  procesosI : Procesos;
  pageActual: number = 1 ;

  private _success = new Subject<string>(); //para mensaje
  staticAlertClosed = false;  //para mensaje
  successMessage: string;  //para mensaje
  modalReference: NgbModalRef;  //para mensaje
  

  constructor(
    private modalService: NgbModal,
    private formBuilder : FormBuilder,
    private procesosService : ProcesosService,
  ) { 
    this.procesosService.getProcesosLista().subscribe(response =>{
      this.apiProcesos = response;
    });
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nombre : ['',[Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
      link  : ['',[Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
    });
    }
    get f(){ return this.form.controls; }

    llamaModalMod(modal, pro : Procesos){
      this.submitted = false;
      this.form.reset({nombre: pro.nombre, link: pro.link});
      this.modalReference = this.modalService.open(modal, { centered: true });
      this.index = pro.idpro; 
    }

    onSubmit(){
      this.submitted = true;
      if ((this.form.invalid) == true) {
         return;
      }
      this.procesosI= {
        idpro : 0,
        nombre : (this.form.controls.nombre.value).toUpperCase(),
        link   : (this.form.controls.link.value),
        estado : 1,
      }
      this.procesosService.modificarProcesos(this.index, this.procesosI).subscribe(response => {
        this.procesosService.getProcesosLista().subscribe( response =>{
          this.apiProcesos = response;
          
        });
        },  
        error => {  
          console.log("error while saving data in the DB"); 
        }      
      ); 
      this.modalReference.close();  //para cerrar
      this._success.next(`Los Datos se GUARDARON Satisfactoriamente..!`);  //para mensaje
    }

    llamaModalDel(modal, pro : Procesos){
      this.modalReference = this.modalService.open(modal, { centered: true });
      this.procesosI = pro;
    }

    onSubmitDel() {
      this.submitted = true; 
      this.procesosService.deleteProcesos(this.procesosI.idpro).subscribe(  
        response => {
            console.log("Eliminacion logica correcta"); 
            // REFERESCA LA LISTA
            this.procesosService.getProcesosLista().subscribe( response =>{
              this.apiProcesos = response;
              
            });
            
        },  
        error => {  
          console.log("Eror al modificar");  
        }      
      );  
      this.modalReference.close();  //para cerrar
    }
    
    llamaModalHab(modal, pro : Procesos){
      //para que la ventana modal se cierre
      this.modalReference = this.modalService.open(modal, { centered: true });
      this.procesosI = pro;
    }
    
    onSubmitHab() {
    this.submitted = true; 
    this.procesosService.habilitarProcesos(this.procesosI.idpro).subscribe(  
      response => {
          console.log("Habilitacion correcta"); 
          // REFERESCA LA LISTA
          this.procesosService.getProcesosLista().subscribe( response =>{
            this.apiProcesos = response;
            
          });
          
      },  
      error => {  
        console.log("Eror al modificar");  
      }      
    );  
    this.modalReference.close();  //para cerrar
    }

    listarProcesos(){
      this.procesosService.getProcesosLista().subscribe(response =>{
        this.apiProcesos = response;
      });
    }
    


  //filtro
  onChangeFiltroNombre(xnombre:string, xestado : number){
    this.procesosService.getProcesosListaNombres(xnombre, xestado).subscribe( response =>{
      console.log( xestado+ "aqui"); 
      this.apiProcesos = response;
    });
  }

}
