import { Component, OnInit, ViewChild } from '@angular/core';
import { DetrolesComponent } from './detroles/detroles.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Roles } from 'src/app/model/roles.model';
import { Subject } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RolesService } from '../../service/roles.service';

@Component({
  selector: 'app-g-roles',
  templateUrl: './g-roles.component.html',
  styleUrls: ['./g-roles.component.css']
})
export class GRolesComponent implements OnInit {

  @ViewChild (DetrolesComponent) detalleRoles : DetrolesComponent

  form : FormGroup;
  formFiltro : FormGroup;
  submitted = false;
  rolesI : Roles;
  roles: Roles[];
  apiRoles: any;

  private _success = new Subject<string>(); 
  staticAlertClosed = false;  
  successMessage: string;  
  modalReference: NgbModalRef; 
  

  constructor(
    private modalService: NgbModal,
    private formBuilder : FormBuilder,
    private rolesService : RolesService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nombre : ['', [Validators.required,Validators.minLength(5), Validators.maxLength(30)]],
    });
    this.formFiltro = this.formBuilder.group({
      filtro: [''],
      estadoRol: ['-1', [Validators.required]]
    });
  } 
  get f() { return this.form.controls; }
  get f2() { return this.formFiltro.controls;}

  llamaModalAdd(modal){
    this.submitted = false;
    this.form.reset([{nombre:''}]);
    this.modalReference = this.modalService.open(modal, { centered: true });
  }
  


  filtrarNombre(): void {
    const filtro = this.formFiltro.value.filtro.toUpperCase();
    const estadoRol = this.formFiltro.value.estadoRol;
    console.log("filtrar..");
    this.detalleRoles.onChangeFiltroNombre(filtro, estadoRol);

    this.rolesService.getRolesListaNombres(filtro,  estadoRol). subscribe(respon =>{
      this.apiRoles = respon;
    });
  }
  onSubmit(){
    this.submitted = true;
    if ((this.form.invalid) == true) {
       return;
    }
    this.rolesI = {
      idrol : 0,
      nombre : (this.form.controls.nombre.value).toUpperCase(),
      estado : 1,
    }
    this.rolesService.saveRoles(this.rolesI).subscribe(response => {
      this.detalleRoles.listarRoles();
      },  
      error => {  
        console.log("error while saving data in the DB"); 
        this.formFiltro.controls.filtro.setValue('');
        this.formFiltro.controls.estadoRol.setValue('-1');
        this.detalleRoles.onChangeFiltroNombre('', -1);
      }      
    ); 
    this.modalReference.close();  //para cerrar
    this._success.next(`Los Datos se GUARDARON Satisfactoriamente..!`);  //para mensaje
  }



}
