import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { Corrales } from 'src/app/model/corrales.model';
import { Tipoanimal } from 'src/app/model/tipoanimal.model';
import { Tiposervicios } from 'src/app/model/tiposervicios.model';
import { AnimalesService } from 'src/app/service/animales.service';
import { CorralesService } from 'src/app/service/corrales.service';

@Component({
  selector: 'app-detcorrales',
  templateUrl: './detcorrales.component.html',
  styleUrls: ['./detcorrales.component.css']
})
export class DetcorralesComponent implements OnInit {

  apiCorrales : any;
  index = 0;
  submitted = false;
  form : FormGroup;
  corralesI : Corrales;
  tipoanimalI: Tipoanimal;
  apiTipoanimal :any;
  pageActual :number = 1;

  private _success = new Subject<string>(); //para mensaje
  staticAlertClosed = false;  //para mensaje
  successMessage: string;  //para mensaje
  modalReference: NgbModalRef;  //para mensaje

  constructor(
    private modalService    : NgbModal,
    private formBuilder     : FormBuilder,
    private corS            : CorralesService,
    private aniS            : AnimalesService,
  ) { 
    this.corS.getCorralesLista().subscribe(resp =>{
      this.apiCorrales = resp;
    });
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
  }

  get f() { return this.form.controls;}

  listarCorrales(){
    this.corS.getCorralesLista().subscribe(resp =>{
      this.apiCorrales = resp;
    });
  }

  llamaModalMod(modal, cor : Corrales){
    this.submitted = false;
    //inicializar valores del formulario
    this.form.reset({ nomcor: cor.nomcor, capcor: cor.capcor,  tipoanimal: cor.tipoanimal.idtip});
    //para que la ventana modal se cierre
    this.modalReference = this.modalService.open(modal, { centered: true });  
    this.index = cor.idcorral; 
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
      corani : null,
      estado : 1,
      tipoanimal      : this.tipoanimalI,
    }

    this.corS.modificarCorrales(this.index, this.corralesI).subscribe(response => {
      this.corS.getCorralesLista().subscribe( response =>{
        this.apiCorrales = response;
      });
      },  
      error => {  
        console.log("error while saving data in the DB"); 
      }      
    ); 
    this.modalReference.close();  //para cerrar
  }

  
  llamaModalDel( modal, cor : Corrales){
    this.modalReference = this.modalService.open(modal, { centered: true });  
    this.corralesI = cor;
  }

  onSubmitDel() {
    this.submitted = true; 
    this.corS.deleteCorrales(this.corralesI.idcorral).subscribe(  
      response => {
          console.log("Eliminacion logica correcta"); 
          // REFERESCA LA LISTA
          this.corS.getCorralesLista().subscribe( response =>{
            this.apiCorrales = response;
          });
          
      },  
      error => {  
        console.log("Eror al modificar");  
      }      
    );  
    this.modalReference.close();  //para cerrar
  }
  
  //filtro
  onChangeFiltroNombre(xnomcor:string, xestado : number){
    this.corS.getCorNomcor(xnomcor, xestado).subscribe (response =>{
      console.log(xestado + "aqui");
      this.apiCorrales = response;
    });
  }

}
