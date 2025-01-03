import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { Roles } from 'src/app/model/roles.model';
import { RolesService } from '../../../service/roles.service';

@Component({
  selector: 'app-detroles',
  templateUrl: './detroles.component.html',
  styleUrls: ['./detroles.component.css']
})
export class DetrolesComponent implements OnInit {

  apiRoles: any;
  index =  0;
  submitted = false;
  formMod : FormGroup;
  form: FormGroup;
  rolesI: Roles;
  pageActual: number = 1 ;

  private _success = new Subject<string>(); //para mensaje
  staticAlertClosed = false;  //para mensaje
  successMessage: string;  //para mensaje
  modalReference: NgbModalRef;  //para mensaje
  

  constructor(
    private modalService: NgbModal,
    private formBuilder : FormBuilder,
    private rolesServicio: RolesService
  ) {
    this.rolesServicio.getRolesLista().subscribe( response =>{
      this.apiRoles = response;
    });
  }  

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nombre : ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
    });
  }
  get f() { return this.form.controls;}

  llamaModalMod(modal, rol : Roles){
    this.submitted = false;
    this.form.reset({nombre: rol.nombre});
    this.modalReference = this.modalService.open(modal, { centered: true });
    this.index = rol.idrol; 
  }

  onSubmit(){
    this.submitted = true;
    if ((this.form.invalid) == true) {
       return;
    }
    this.rolesI= {
      idrol : 0,
      nombre : (this.form.controls.nombre.value).toUpperCase(),
      estado : 1,
    }
    this.rolesServicio.modificarRoles(this.index, this.rolesI).subscribe(response => {
      this.rolesServicio.getRolesLista().subscribe( response =>{
        this.apiRoles = response;
        
      });
      },  
      error => {  
        console.log("error while saving data in the DB"); 
      }      
    ); 
    this.modalReference.close();  //para cerrar
    this._success.next(`Los Datos se GUARDARON Satisfactoriamente..!`);  //para mensaje
  }

  llamaModalDel(modal, rol : Roles){
    this.modalReference = this.modalService.open(modal, { centered: true });
    this.rolesI = rol ;
  }

onSubmitDel() {
  this.submitted = true; 
  this.rolesServicio.deleteRoles(this.rolesI.idrol).subscribe(  
    response => {
        console.log("Eliminacion logica correcta"); 
        // REFERESCA LA LISTA
        this.rolesServicio.getRolesLista().subscribe( response =>{
          this.apiRoles = response;
          
        });
        
    },  
    error => {  
      console.log("Eror al modificar");  
    }      
  );  
  this.modalReference.close();  //para cerrar
}
//modal Habilitar 
llamaModalHab(modal, rol : Roles){
  this.modalReference = this.modalService.open(modal, { centered: true });
  this.rolesI = rol;
}

onSubmitHab() {
this.submitted = true; 
this.rolesServicio.habilitarRoles(this.rolesI.idrol).subscribe(  
  response => {
      console.log("Habilitacion correcta"); 
      // REFERESCA LA LISTA
      this.rolesServicio.getRolesLista().subscribe( response =>{
        this.apiRoles = response;
        
      });
      
  },  
  error => {  
    console.log("Eror al modificar");  
  }      
);  
this.modalReference.close();  //para cerrar
}

listarRoles(){
  this.rolesServicio.getRolesLista().subscribe( response =>{
    this.apiRoles = response;
  });
}


  //filtro
  onChangeFiltroNombre(xnombre:string, xestado : number){
    this.rolesServicio.getRolesListaNombres(xnombre, xestado).subscribe( response =>{
      console.log( xestado+ "aqui"); 
      this.apiRoles = response;
    });
  }


}
