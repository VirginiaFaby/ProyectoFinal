import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { Menus } from 'src/app/model/menus.model';
import { MenusService } from 'src/app/service/menus.service';
import { DetmenusComponent } from './detmenus/detmenus.component';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-g-menus',
  templateUrl: './g-menus.component.html',
  styleUrls: ['./g-menus.component.css']
})
export class GMenusComponent implements OnInit {

   @ViewChild(DetmenusComponent) detalleMenus : DetmenusComponent

  form : FormGroup;
  formFiltro : FormGroup;
  submitted = false;
  menusI : Menus;
  //menus : Menus[];
  apiMenus: any;

  private _success = new Subject<string>(); 
  staticAlertClosed = false;  
  successMessage: string;  
  modalReference: NgbModalRef;  

  constructor(
    private modalService: NgbModal,
    private formBuilder : FormBuilder,
    private menusService : MenusService,
    private xrouter: Router, 
    private activatedroute: ActivatedRoute
  ) { }


  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required,Validators.minLength(5), Validators.maxLength(30)]],
    });
    this.formFiltro = this.formBuilder.group({
      filtro: [''],
      estadosMen : ['-1', [Validators.required]]
    }); 
  }
  
  get f(){ return this.form.controls;}
  get f2() { return this.formFiltro.controls;}

  llamaModalAdd(modal){
    this.submitted = false;
    //inicializar valores del formulario
    this.form.reset([{nombre:''}]);
    //para que la ventana modal se cierre
    this.modalReference = this.modalService.open(modal, { centered: true });  
  }

  filtrarNombre(): void {
    const filtro = this.formFiltro.value.filtro.toUpperCase();
    const estadosMen = this.formFiltro.value.estadosMen;
    console.log("filtrar..");
    this.detalleMenus.onChangeFiltroNombre(filtro, estadosMen);

    this.menusService.getMenusListaNombres(filtro,  estadosMen). subscribe(respon =>{
      this.apiMenus = respon;
    });
  }

  onSubmit(){
    this.submitted = true;
    if ((this.form.invalid) == true) {
       return;
    }
    this.menusI = {
      idmen : 0,
      nombre : (this.form.controls.nombre.value).toUpperCase(),
      estado : 1,
    }
    this.menusService.saveMenus(this.menusI).subscribe(response => {
      this.detalleMenus.listarMenu();
      },  
      error => {  
        console.log("error while saving data in the DB"); 
        this.formFiltro.controls.filtro.setValue('');
        this.formFiltro.controls.estadosMen.setValue('-1');
        this.detalleMenus.onChangeFiltroNombre('', -1);
      }      
    ); 
    this.modalReference.close();  //para cerrar
    this._success.next(`Los Datos se GUARDARON Satisfactoriamente..!`);  //para mensaje
  }

}
