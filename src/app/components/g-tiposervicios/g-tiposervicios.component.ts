import { Component, OnInit, ViewChild } from '@angular/core';
import { DettiposerviciosComponent } from './dettiposervicios/dettiposervicios.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tipoanimal } from 'src/app/model/tipoanimal.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TiposerviciosService } from 'src/app/service/tiposervicios.service';
import { Tiposervicios } from 'src/app/model/tiposervicios.model';
import { AnimalesService } from 'src/app/service/animales.service';

@Component({
  selector: 'app-g-tiposervicios',
  templateUrl: './g-tiposervicios.component.html',
  styleUrls: ['./g-tiposervicios.component.css']
})
export class GTiposerviciosComponent implements OnInit {

  @ViewChild (DettiposerviciosComponent) detalleTiposervicios : DettiposerviciosComponent; 

  form        : FormGroup;
  formFiltro  : FormGroup;
  submitted   = false;
  tipsI       : Tiposervicios;
  tipoanimalI: Tipoanimal;
  apiTiposervicios : any;
  apiTipoanimal: any;

  modalReference: NgbModalRef; 


  constructor(
    private modalService : NgbModal,
    private formBuilder  : FormBuilder,
    private tipsS        : TiposerviciosService,
    private aniS         : AnimalesService,
    
  ) { 
    this.aniS.getTipoAnimalesLista().subscribe((respo) => {
      this.apiTipoanimal = respo;
    });
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nomser      :  ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30),]],
      preser      : ['', [Validators.required, Validators.min(0)]],
      desser      : ['', [ Validators.minLength(5), Validators.maxLength(100),]],
      tipoanimal  : ['', [Validators.required]],
    });
    this.formFiltro = this.formBuilder.group({
      filtro :[''],
      idtip  : ['-1'],
      estadoTips: ['-1', [Validators.required]],
    });
    
  }

  get f(){ return this.form.controls;}
  get f2() { return this.formFiltro.controls;}

  llamaModalAdd(modal){
    this.submitted = false;
    this.form.reset([{nomser : '', preser : '', desser : ''}]);
    //para que la ventana modal se cierre
    this.modalReference = this.modalService.open(modal, { centered: true });  
  }

  filtrarNombre(): void {
    const filtro = this.formFiltro.value.filtro.toUpperCase();
    const idtip = this.formFiltro.value.idtip;
    const estadoTips = this.formFiltro.value.estadoTips;
    console.log("filtrar..");
    this.detalleTiposervicios.onChangeFiltroNombres(filtro, idtip, estadoTips);

    this.tipsS.listaTipsNom(filtro, idtip, estadoTips). subscribe(respon =>{
      this.apiTiposervicios = respon;
    })
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
    this.tipsI = {
      idtipser  : 0,
      nomser    : (this.form.controls.nomser.value).toUpperCase(),
      preser    : (this.form.controls.preser.value),
      desser    : (this.form.controls.desser.value).toUpperCase(),
      estado    : 1,
      tipoanimal: this.tipoanimalI,

    }
    this.tipsS.saveTiposervicios(this.tipsI).subscribe(response => {
      this.detalleTiposervicios.listarTiposer();

      },  
      error => {  
        console.log("error while saving data in the DB"); 
        this.formFiltro.controls.filtro.setValue('');
        this.formFiltro.controls.idtip.setValue('-1');
        this.formFiltro.controls.estadoTips.setValue('-1');
        this.detalleTiposervicios.onChangeFiltroNombres('', -1, -1);
      }      
    ); 
    this.modalReference.close();  //para cerrar
    
  }
}
