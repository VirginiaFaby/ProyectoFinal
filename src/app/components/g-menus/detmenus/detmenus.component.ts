import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenusService } from '../../../service/menus.service';
import { Menus } from 'src/app/model/menus.model';
import { Subject } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-detmenus',
  templateUrl: './detmenus.component.html',
  styleUrls: ['./detmenus.component.css']
})
export class DetmenusComponent implements OnInit {

  apiMenus: any;
  index = 0;
  submitted = false;
  formMod: FormGroup;
  form: FormGroup;
  menusI: Menus;
  pageActual: number = 1;


  private _success = new Subject<string>(); //para mensaje
  staticAlertClosed = false;  //para mensaje
  successMessage: string;  //para mensaje
  modalReference: NgbModalRef;  //para mensaje


  constructor(
    private menusService: MenusService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {
    this.menusService.getMenusLista().subscribe(response => {
      this.apiMenus = response;
    });
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
    });
  }

  get f() { return this.form.controls; }

  llamaModalMod(modal, men: Menus) {
    this.submitted = false;
    //inicializar valores del formulario
    this.form.reset({ nombre: men.nombre });
    //para que la ventana modal se cierre
    this.modalReference = this.modalService.open(modal, { centered: true }); 
    this.index = men.idmen;
  }

  onSubmit() {
    this.submitted = true;
    if ((this.form.invalid) == true) {
      return;
    }
    this.menusI = {
      idmen: 0,
      nombre: (this.form.controls.nombre.value).toUpperCase(),
      estado: 1,
    }
    this.menusService.modificarMenus(this.index, this.menusI).subscribe(response => {
      this.menusService.getMenusLista().subscribe(response => {
        this.apiMenus = response;

      });
    },
      error => {
        console.log("error while saving data in the DB");
      }
    );
    this.modalReference.close();  //para cerrar
    this._success.next(`Los Datos se GUARDARON Satisfactoriamente..!`);  //para mensaje
  }

  llamaModalDel(modal, men: Menus) {
    //para que la ventana modal se cierre
    this.modalReference = this.modalService.open(modal, { centered: true }); 
    this.menusI = men;
  }

  onSubmitDel() {
    this.submitted = true;
    this.menusService.deleteMenus(this.menusI.idmen).subscribe(
      response => {
        console.log("Eliminacion logica correcta");
        // REFERESCA LA LISTA
        this.menusService.getMenusLista().subscribe(response => {
          this.apiMenus = response;

        });

      },
      error => {
        console.log("Eror al modificar");
      }
    );
    this.modalReference.close();  //para cerrar
  }
  //modal Habilitar 
  llamaModalHab(modal, men: Menus) {
    //para que la ventana modal se cierre
    this.modalReference = this.modalService.open(modal, { centered: true }); 
    this.menusI = men;
  }

  onSubmitHab() {
    this.submitted = true;
    this.menusService.habilitarMenus(this.menusI.idmen).subscribe(
      response => {
        console.log("Habilitacion correcta");
        // REFERESCA LA LISTA
        this.menusService.getMenusLista().subscribe(response => {
          this.apiMenus = response;

        });

      },
      error => {
        console.log("Eror al modificar");
      }
    );
    this.modalReference.close();  //para cerrar
  }

  listarMenu(){
    this.menusService.getMenusLista().subscribe(response => {
      this.apiMenus = response;
    });
  }


  //filtro
  onChangeFiltroNombre(xnombre: string, xestado: number) {
    this.menusService.getMenusListaNombres(xnombre, xestado).subscribe(response => {
      console.log(xestado + "aqui");
      this.apiMenus = response;
    });
  }

}
