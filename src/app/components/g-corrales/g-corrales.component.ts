import { Component, OnInit, ViewChild } from '@angular/core';
import { DetcorralesComponent } from './detcorrales/detcorrales.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CorralesService } from 'src/app/service/corrales.service';
import { Corrales } from 'src/app/model/corrales.model';
import { Tipoanimal } from 'src/app/model/tipoanimal.model';
import { AnimalesService } from 'src/app/service/animales.service';

@Component({
  selector: 'app-g-corrales',
  templateUrl: './g-corrales.component.html',
  styleUrls: ['./g-corrales.component.css']
})
export class GCorralesComponent implements OnInit {

  @ViewChild (DetcorralesComponent) detalleCorrales : DetcorralesComponent

  form : FormGroup;
  formFiltro: FormGroup;
  submitted = false;
  corralesI: Corrales;
  tipoanimalI: Tipoanimal;
  apiTipoanimal: any;
  apiCorrales : any; 

  private _success  = new Subject<string>(); 
  staticAlertClosed = false;  
  successMessage    : string;  
  modalReference    : NgbModalRef;

  constructor(
    private modalService : NgbModal,
    private formBuilder : FormBuilder,
    private corS : CorralesService,
    private aniS : AnimalesService,
  ) {
    this.aniS.getTipoAnimalesLista().subscribe((respo) => {
      this.apiTipoanimal = respo;
    });
   }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nomcor    : ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
      capcor    : ['', [Validators.required, Validators.min(0), Validators.pattern(/^[1-9]\d*$/)]],
      tipoanimal: ['', [Validators.required]],
    });
    this.formFiltro = this.formBuilder.group({
      filtro: [''],
      estadosCor : ['-1', [Validators.required]]
    });
  }
  get f(){ return this.form.controls;}
  get f2(){ return this.formFiltro.controls;}

  llamaModalAdd(modal){
    this.submitted = false;
    //inicializar valores del formulario
    this.form.reset([{nomcor:'', capcor:'',  tipoanimal:''}]);
    //para que la ventana modal se cierre
    this.modalReference = this.modalService.open(modal, { centered: true });  
  }


  filtrarNombre(): void {
    const filtro = this.formFiltro.value.filtro.toUpperCase();
    const estadosCor = this.formFiltro.value.estadosCor;
    console.log("filtrar..");
    this.detalleCorrales.onChangeFiltroNombre(filtro, estadosCor);

    this.corS.getCorNomcor(filtro,  estadosCor). subscribe(respon =>{
      this.apiCorrales = respon;
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
    this.corralesI = {
      idcorral : 0,
      nomcor : (this.form.controls.nomcor.value).toUpperCase(),
      capcor : (this.form.controls.capcor.value),
      corani : 0,
      estado : 1,
      tipoanimal      : this.tipoanimalI,
    }
    this.corS.saveCorrales(this.corralesI).subscribe(response =>{  
      this.detalleCorrales.listarCorrales();
      },  
      error => {  
        console.log("error while saving data in the DB"); 
        this.formFiltro.controls.filtro.setValue('');
        this.formFiltro.controls.estadosCor.setValue('-1');
        this.detalleCorrales.onChangeFiltroNombre('', -1);
      }      
    ); 
    this.modalReference.close();  //para cerrar
    this._success.next(`Los Datos se GUARDARON Satisfactoriamente..!`);  //para mensaje
  }




}
