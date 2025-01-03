import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LogeoService } from './../../../service/logeo.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Personas } from 'src/app/model/personas.model';

@Component({
  selector: 'app-logeo',
  templateUrl: './logeo.component.html',
  styleUrls: ['./logeo.component.css']
})
export class LogeoComponent implements OnInit {

  formAcceso: FormGroup;
  submitted = false;
  xusuario: string;
  xusuario2: string;
  bienvenido: string;
  xidpro: number;
  xlogin: string;
  modalReference: NgbModalRef;

  hidePassword = true;
  hidePasswordRep = true;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LogeoService,
    private xrouter: Router,
    private modalService: NgbModal

  ) { }

  ngOnInit() {
    this.formAcceso = this.formBuilder.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  get f() { return this.formAcceso.controls; }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  togglePasswordRepVisibility() {
    this.hidePasswordRep = !this.hidePasswordRep;
  }

  iniciarSesion(modal: any) {
    this.submitted = true;
    console.log("Ingresando..");
    if ((this.formAcceso.invalid)) {
      return;
    }
    this.loginService.getPersona(this.formAcceso.controls.login.value, this.formAcceso.controls.password.value)
      .subscribe(
        (data: Personas) => {
          if (data) {                    // Validar los apellidos nulos
            if (data.ap == null) {
              this.xusuario = data.nombre + " " + data.am;
              this.xusuario2 = data.nombre + " " + data.am;
            } else if (data.am == null) {
              this.xusuario = data.nombre + " " + data.ap;
              this.xusuario2 = data.nombre + " " + data.ap;
            } else {
              this.xusuario = data.nombre + " " + data.ap + " " + data.am;
              this.xusuario2 = data.nombre + " " + data.ap + " " + data.am;
            }

            this.bienvenido = 'Bienvenido:';
            this.xidpro = data.idper;
            this.xlogin = this.formAcceso.controls.login.value;
            localStorage.setItem('currentUser', JSON.stringify(data));
            this.loginService.selogeo();
            this.modalReference = this.modalService.open(modal);
          } else {
            console.log("Usuario incorrecto..");
            this.xusuario = "Invitado";
            this.xusuario2 = 'Usuario y/o password incorrectos.';
            this.bienvenido = 'Error:';
            this.xidpro = 0;
            this.modalReference = this.modalService.open(modal);
          }
          this.ejecutar(this.xusuario, this.xlogin, this.xrouter, modal);
        },
        (error: any) => console.log(error),
        () => console.log('all data gets')
      );
  }

  ejecutar(xuser: any, xlogin: string, xro: Router, modal: any) {
    console.log('ACCESO --> parametro::' + xuser + " xlogin=>" + xlogin);
    let mipromesa = new Promise(function (resolve: any, reject: any) {
      resolve();
    });

    mipromesa.then(function () {
      xro.navigate([{ outlets: { footer: ['menuFooter', xuser] } }]);
    }).then(function () {
      xro.navigate([{ outlets: { menus: ['menuRol', xlogin] } }]);
    });

  }

  // BIENVENIDO A USUARIOS
  Bienvenido() {
    this.modalReference.close();
    this.xrouter.navigate(['/portada']);
  }

  goHome() {
    this.xrouter.navigate(['/']);
  }

}
