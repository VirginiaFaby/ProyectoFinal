import { Component, OnInit, ViewChild } from '@angular/core';
import { DetpersonasComponent } from './detpersonas/detpersonas.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Personas } from 'src/app/model/personas.model';
import { Subject } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PersonasService } from 'src/app/service/personas.service';

@Component({
  selector: 'app-g-personas',
  templateUrl: './g-personas.component.html',
  styleUrls: ['./g-personas.component.css']
})
export class GPersonasComponent implements OnInit {

  @ViewChild ( DetpersonasComponent) detallepersonas : DetpersonasComponent

  form : FormGroup;
  formFiltro: FormGroup;
  submitted = false;
  personasI : Personas;
  apiPersonas: any;

  private _success  = new Subject<string>(); 
  staticAlertClosed = false;  
  successMessage    : string;  
  modalReference    : NgbModalRef;

  constructor(
    private modalService : NgbModal,
    private formBuilder : FormBuilder,
    private perS : PersonasService,

  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      cedula   : ['', [Validators.required, Validators.minLength(7), Validators.maxLength(10), Validators.pattern(/^[1-9]\d*$/)]],
      nombre   : ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i)]],
      ap       : ['', [Validators.minLength(3), Validators.maxLength(20), Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i)]],
      am       : ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i)]],
      genero   : ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1), Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i) ]],
      telefono : ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern(/^[67]\d{7,8}$/)]],
      direccion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      email    : ['', [Validators.email]],
    });
    this.formFiltro = this.formBuilder.group({
      filtro: [''],
      estadosPer : ['-1', [Validators.required]]
    });
  }

  get f() { return this.form.controls;}
  get f2(){ return this.formFiltro.controls;}

  llamaModalAdd(modal){
    
    this.submitted = false;
    this.form.reset([{cedula:''},{nombre:''},{ap:''}, {am:''}, {genero:''}, {telefono:''}, {direccion:''}, {email:''}]);
   this.modalReference = this.modalService.open(modal, { centered: true });
  }

  
  filtrarNombre(): void {
    const filtro = this.formFiltro.value.filtro.toUpperCase();
    const estadosPer = this.formFiltro.value.estadosPer;
    console.log("filtrar..");
    this.detallepersonas.onChangeFiltroNombre(filtro, estadosPer);

    this.perS.getPersonasListaNombres(filtro, estadosPer). subscribe(respon =>{
      this.apiPersonas = respon;
    });
  }

    //adicionar empleado
    onSubmit(){
      this.submitted = true;
      if ((this.form.invalid) == true) {
         return;
      }
      this.personasI = {
        idper       : 0,
        cedula      : (this.form.controls.cedula.value).toUpperCase(),
        nombre      : (this.form.controls.nombre.value).toUpperCase(),
        ap          : (this.form.controls.ap.value),
        am          : (this.form.controls.am.value).toUpperCase(),
        genero      : (this.form.controls.genero.value).toUpperCase(),
        telefono    : (this.form.controls.telefono.value).toUpperCase(),
        direccion   : (this.form.controls.direccion.value).toUpperCase(),
        email       : (this.form.controls.email.value),
        estado      : 1,
        usuarios    : null,
      }
      
  
      this.perS.savePersonas(this.personasI).subscribe(response => {
       this.detallepersonas.listarEmp();
      
        },  
        error => {  
          console.log("error while saving data in the DB"); 
          this.formFiltro.controls.filtro.setValue('');
          this.formFiltro.controls.estadosPer.setValue('-1');
          this.detallepersonas.onChangeFiltroNombre('', -1);
        }      
      ); 
  
      this.modalReference.close(); 
  
    }
  

}
