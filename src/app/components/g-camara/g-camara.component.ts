import { Component, OnInit, ViewChild } from '@angular/core';
import { DetcamaraComponent } from './detcamara/detcamara.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camara } from 'src/app/model/camara.model';
import { Subject } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CamaraService } from 'src/app/service/camara.service';
import { Tipoanimal } from 'src/app/model/tipoanimal.model';
import { AnimalesService } from 'src/app/service/animales.service';

@Component({
  selector: 'app-g-camara',
  templateUrl: './g-camara.component.html',
  styleUrls: ['./g-camara.component.css']
})
export class GCamaraComponent implements OnInit {

  @ViewChild ( DetcamaraComponent) detalleCamara : DetcamaraComponent

  form : FormGroup;
  formFiltro: FormGroup;
  submitted = false;
  camaraI : Camara;
  apiCamara : any;
  tipoanimalI : Tipoanimal; 
  apiTipoanimal: any;
 
  private _success  = new Subject<string>(); 
  staticAlertClosed = false;  
  successMessage    : string;  
  modalReference    : NgbModalRef;


  constructor(
    private modalService : NgbModal,
    private formBuilder  : FormBuilder,
    private camS         : CamaraService,
    private aniS :        AnimalesService,
  ) { 
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
    this.formFiltro = this.formBuilder.group({
      filtro: [''],
      estadosCam : ['-1', [Validators.required]]
    });
  }
  get f(){ return this.form.controls;}
  get f2(){ return this.formFiltro.controls;}

  llamaModalAdd(modal){
    this.submitted = false;
    //inicializar valores del formulario
    this.form.reset([{nomcam:'', capcam:'', temcam :'', unitem:'',tipoanimal:''}]);
    //para que la ventana modal se cierre
    this.modalReference = this.modalService.open(modal, { centered: true });  
  }




  filtrarNombre(): void {
    const filtro = this.formFiltro.value.filtro.toUpperCase();
    const estadosCam = this.formFiltro.value.estadosCam;
    console.log("filtrar..");
    this.detalleCamara.onChangeFiltroNombre(filtro, estadosCam);

    this.camS.getCamNomcam(filtro,  estadosCam). subscribe(respon =>{
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
    this.camaraI = {
      idcamfri : 0,
      nomcam    : (this.form.controls.nomcam.value).toUpperCase(),
      capcam    : (this.form.controls.capcam.value),
      temcam    : (this.form.controls.temcam .value),
      unitem    : (this.form.controls.unitem.value),
      canting : 0,
      saldo   :  (this.form.controls.capcam.value),
      estado : 1,
      tipoanimal      : this.tipoanimalI,
    }
    this,this.camS.saveCamara(this.camaraI).subscribe(response =>{  
      this.detalleCamara.listarCamara();
 
      },  
      error => {  
        console.log("error while saving data in the DB"); 
        this.formFiltro.controls.filtro.setValue('');
        this.formFiltro.controls.estadosCam.setValue('-1');
        this.detalleCamara.onChangeFiltroNombre('', -1);
      }      
    ); 
    this.modalReference.close();  //para cerrar
    this._success.next(`Los Datos se GUARDARON Satisfactoriamente..!`);  //para mensaje
  }




}
