import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { Procesos } from 'src/app/model/procesos.model';
import { DetprocesosComponent } from './detprocesos/detprocesos.component';
import { ProcesosService } from '../../service/procesos.service';

@Component({
  selector: 'app-g-procesos',
  templateUrl: './g-procesos.component.html',
  styleUrls: ['./g-procesos.component.css']
})
export class GProcesosComponent implements OnInit {

  @ViewChild (DetprocesosComponent) detalleProcesos : DetprocesosComponent;

  form : FormGroup;
  formFiltro : FormGroup;
  submitted = false;
  procesosI : Procesos;
  procesos : Procesos[];
  apiProcesos : any;

  private _success = new Subject<string>(); 
  staticAlertClosed = false; 
  successMessage: string;  
  modalReference: NgbModalRef;  


  constructor(
    private modalService: NgbModal,
    private formBuilder : FormBuilder,
    private procesosService : ProcesosService,
  ) { }

  ngOnInit(): void {
    
    this.form = this.formBuilder.group({
      nombre : [ '', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
      link : [ '', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
    });
    this.formFiltro = this.formBuilder.group({
      filtro: [''],
      estadoPro: ['-1', [Validators.required]],
    });
  }
  get f() { return this.form.controls; }
  get f2() { return this.formFiltro.controls; }

  llamaModalAdd(modal){
    this.submitted = false;
    this.form.reset([{nombre:''}, {link:''}]);
    this.modalReference = this.modalService.open(modal, { centered: true }); 
  }


  filtrarNombre(): void {
    const filtro = this.formFiltro.value.filtro.toUpperCase();
    const estadoPro = this.formFiltro.value.estadoPro;
    console.log("filtrar..");
    this.detalleProcesos.onChangeFiltroNombre(filtro, estadoPro);

    this.procesosService.getProcesosListaNombres(filtro,  estadoPro). subscribe(respon =>{
      this.apiProcesos = respon;
    });
  }

  onSubmit(){
    this.submitted = true;
    if ((this.form.invalid) == true) {
       return;
    }
    this.procesosI = {
      idpro : 0,
      nombre : (this.form.controls.nombre.value).toUpperCase(),
      link : (this.form.controls.link.value),
      estado : 1,
    }
    this.procesosService.saveProcesos(this.procesosI).subscribe(response => {
      this.detalleProcesos.listarProcesos();
      },  
      error => {  
        console.log("error while saving data in the DB"); 
        this.formFiltro.controls.filtro.setValue('');
        this.formFiltro.controls.estadoPro.setValue('-1');
        this.detalleProcesos.onChangeFiltroNombre('', -1);
      }      
    ); 
    this.modalReference.close();  //para cerrar
    this._success.next(`Los Datos se GUARDARON Satisfactoriamente..!`);  //para mensaje
    }
}
