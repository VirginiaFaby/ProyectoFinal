import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { Personas } from 'src/app/model/personas.model';
import { Roles } from 'src/app/model/roles.model';
import { Usuarios } from 'src/app/model/usuarios.model';
import { PersonasService } from 'src/app/service/personas.service';
import { RolesService } from 'src/app/service/roles.service';
import { UsuariosService } from 'src/app/service/usuarios.service';

@Component({
  selector: 'app-detpersonas',
  templateUrl: './detpersonas.component.html',
  styleUrls: ['./detpersonas.component.css']
})
export class DetpersonasComponent implements OnInit {


  form: FormGroup;
  formUsuario: FormGroup;
  index = 0;
  submitted = false;
  pageActual: number = 1;
  personasI: Personas;
  usuario: Usuarios;
  apiPersonas: any;
  apiUsuarios: any;
  perInfo: string;
  


  hidePassword = true;
  hidePasswordRep = true;



  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage: string;
  modalReference: NgbModalRef;
 

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private perS: PersonasService,
    private usuS: UsuariosService,
   

  ) {

  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      cedula: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(10), Validators.pattern(/^[1-9]\d*$/)]],
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i)]],
      ap: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i)]],
      am: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i)]],
      genero: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1), Validators.pattern(/^[a-z\s\u00E0-\u00FC\u00f1]*$/i)]],
      telefono: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern(/^[67]\d{7,8}$/)]],
      direccion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
    });

    this.formUsuario = this.formBuilder.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required]],
      passwordRep: ['', [Validators.required]],
   
    }, {
      validator: this.MustMatch('password', 'passwordRep')
    });
    this.perS.getPersonasLista().subscribe(response => {
      this.apiPersonas = response;
    });
 
  }

  listarEmp(){
    this.perS.getPersonasLista().subscribe(response => {
      this.apiPersonas = response;
    });
  }

  get f() { return this.form.controls; }
  get f2() { return this.formUsuario.controls; }

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  // Función para poder ver password 

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  togglePasswordRepVisibility() {
    this.hidePasswordRep = !this.hidePasswordRep;
  }

  //Modal de Modificacion 
  llamaModalMod(modal, per: Personas) {
    this.submitted = false;
    this.form.reset({ cedula: per.cedula, nombre: per.nombre, ap: per.ap, am: per.am, genero: per.genero, telefono: per.telefono, direccion: per.direccion, email: per.email });
    this.modalReference = this.modalService.open(modal, { centered: true });
    this.index = per.idper;
  }

  //Modificar 
  onSubmit() {
    this.submitted = true;
    if ((this.form.invalid) == true) {
      return;
    }
    this.personasI = {
      idper: 0,
      cedula: (this.form.controls.cedula.value),
      nombre: (this.form.controls.nombre.value).toUpperCase(),
      ap: (this.form.controls.ap.value).toUpperCase(),
      am: (this.form.controls.am.value).toUpperCase(),
      genero: (this.form.controls.genero.value).toUpperCase(),
      telefono: (this.form.controls.telefono.value),
      direccion: (this.form.controls.direccion.value).toUpperCase(),
      email: (this.form.controls.email.value),
      estado: 1,
      usuarios: null,
    }
    this.perS.modificarPersonas(this.index, this.personasI).subscribe(response => {
      this.perS.getPersonasLista().subscribe(response => {
        this.apiPersonas = response;
      });
    },
      error => {
        console.log("error while saving data in the DB");
      }
    );
    this.modalReference.close();  //para cerrar
    this._success.next(`Los Datos se GUARDARON Satisfactoriamente..!`);  //para mensaje
  }

 
  llamaModalDel(modal, per: Personas) {
    this.modalReference = this.modalService.open(modal, { centered: true }); // Asigna la referencia del modal
    this.personasI = per;
  }
  

  //Eliminacion Logica 
  onSubmitDel() {
    this.submitted = true;
    this.perS.deletePersonas(this.personasI.idper).subscribe(
      response => {
        console.log("Eliminacion logica correcta");
        // REFERESCA LA LISTA
        this.perS.getPersonasLista().subscribe(response => {
          this.apiPersonas = response;
        });
      },
      error => {
        console.log("Eror al modificar");
      }
    );
    this.modalReference.close();  //para cerrar
  }

  //Modal Habilitar 
  llamaModalHab(modal, per: Personas) {
    //para que la ventana modal se cierre
    this.modalReference = this.modalService.open(modal, { centered: true }); 
    this.personasI = per;
  }

  //Habilitar 
  onSubmitHab() {
    this.submitted = true;
    this.perS.habilitarPersonas(this.personasI.idper).subscribe(
      response => {
        console.log("Habilitacion correcta");
        // REFERESCA LA LISTA
        this.perS.getPersonasLista().subscribe(response => {
          this.apiPersonas = response;
        });
      },
      error => {
        console.log("Eror al modificar");
      }
    );
    this.modalReference.close();  //para cerrar
  }

  llamaModalUsuario(modal, per: Personas) {
    this.formUsuario.get('login').enable();
    this.submitted = false;
    this.modalReference = this.modalService.open(modal, { centered: true });
    this.formUsuario.reset([{ login: '' }, { password: '' }, { passwordRep: '' }]);
    this.perInfo = per.nombre;
    if (per.ap != null)
      this.perInfo = this.perInfo + " " + per.ap;
    if (per.am != null)
      this.perInfo = this.perInfo + " " + per.am;
    this.personasI = per;
  }

  onSubmitUsuario() {
    this.submitted = true;
    if ((this.formUsuario.invalid) == true) {
      return;
    }

    this.formUsuario.controls.login.disabled;

    this.usuario = {
      login: (this.formUsuario.controls.login.value),
      password: (this.formUsuario.controls.password.value),
      estado: 1,

    }

    this.personasI.usuarios = this.usuario;

    console.log(this.usuario.login);
    this.usuS.saveUsuario(this.personasI).subscribe(
      response => {
        console.log("Usuario guardado");
        this.usuS.getUsuariosLista().subscribe(response => {
          this.apiUsuarios = response;
        });
      },
      error => {
        console.log("error while saving data in the DB");
      }
    );
    this.modalReference.close();  //para cerrar
    this._success.next(`Los Datos se GUARDARON Satisfactoriamente..!`);  //para mensaje
  }
  //Modal de Modificacion Usuario 
  llamaModalModUsuario(modal, per: Personas) {
    this.submitted = false;
    this.modalReference = this.modalService.open(modal, { centered: true });
    this.formUsuario.reset({ login: per.usuarios.login, password: '', passwordRep: '' });
    this.formUsuario.get('login').disable();
    if (per.ap != '')
      this.perInfo = per.ap + " ";
    if (per.am != '')
      this.perInfo = this.perInfo + per.am + " ";
    this.perInfo = this.perInfo + per.nombre;
    this.personasI = per;
  }

  //Modificacion de Usuario 
  onSubmitModUsuario() {
    this.submitted = true;
    if ((this.formUsuario.invalid) == true) {
      return;
    }
    this.formUsuario.controls.login.disabled;
    this.usuario = {
      login: (this.formUsuario.controls.login.value),
      password: (this.formUsuario.controls.password.value),
      estado: 1,
    }

    this.personasI.usuarios = this.usuario;

    console.log(this.usuario.password);
    this.usuS.modificarUsuario(this.personasI.idper, this.personasI).subscribe(
      response => {
        console.log("Usuario Modificado");
      },
      error => {
        console.log("error while saving data in the DB");
      }
    );
    this.modalReference.close();  //para cerrar
  }


  //Filtro 
  onChangeFiltroNombre(xnombre: string, xestado: number) {
    this.perS.getPersonasListaNombres(xnombre, xestado).subscribe(response => {
      console.log(xestado + "aqui");
      this.apiPersonas = response;
    });
  }

}
