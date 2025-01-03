import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { Tipoanimal } from 'src/app/model/tipoanimal.model';
import { Tipoprodcarnico } from 'src/app/model/tipoprodcarnico.model';
import { AnimalesService } from 'src/app/service/animales.service';
import { TipoprodcarnicoService } from 'src/app/service/tipoprodcarnico.service';

@Component({
  selector: 'app-dettipoprodcarnico',
  templateUrl: './dettipoprodcarnico.component.html',
  styleUrls: ['./dettipoprodcarnico.component.css']
})
export class DettipoprodcarnicoComponent implements OnInit {


  form: FormGroup;
  formFiltro: FormGroup;
  submitted = false;
  tippI: Tipoprodcarnico;
  apiTipoprodcarnico: any;
  tipoanimalI: Tipoanimal;
  apiTipoanimal: any;

  index = 0;
  pageActual: number = 1;

  modalReference: NgbModalRef;

  private _success = new Subject<string>(); //para mensaje
  staticAlertClosed = false;  //para mensaje
  successMessage: string;  //para mensaje


  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private tippS: TipoprodcarnicoService,
    private aniS: AnimalesService,
  ) {
    this.aniS.getTipoAnimalesLista().subscribe((respo) => {
      this.apiTipoanimal = respo;
    });
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nompro: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
      despro: ['', [Validators.required]],
      tipoanimal: ['', [Validators.required]],

    });
    this.tippS.getTipoprodcarnicoLista().subscribe(response => {
      this.apiTipoprodcarnico = response;
    })
  }

  get f() { return this.form.controls; }

  listarTipoprodcarnicos() {
    this.tippS.getTipoprodcarnicoLista().subscribe(repon => {
      this.apiTipoprodcarnico = repon;
    });
  }

  //Modal de Modificacion 
  llamaModalMod(modal, tipp: Tipoprodcarnico) {
    this.submitted = false;
    this.form.reset({ nompro: tipp.nompro, tipo: tipp.tipo, tipoanimal: tipp.tipoanimal.idtip, despro: tipp.despro });
    this.modalReference = this.modalService.open(modal, { centered: true });  
    this.index = tipp.idtipro;
  }

  //Modificar 
  onSubmit() {
    this.submitted = true;
    if ((this.form.invalid) == true) {
      return;
    }

    for (let i = 0; i < this.apiTipoanimal.length; i++) {
      if (this.form.controls.tipoanimal.value == this.apiTipoanimal[i].idtip) {
        this.tipoanimalI = this.apiTipoanimal[i];
      }
    }
    this.tippI = {
      idtipro: 0,
      nompro: (this.form.controls.nompro.value).toUpperCase(),
      tipo: (this.form.controls.tipo.value),
      despro: (this.form.controls.despro.value).toUpperCase(),
      estado: 1,
      tipoanimal: this.tipoanimalI,
    }

    this.tippS.modificarTipoprodcarnico(this.index, this.tippI).subscribe(response => {
      this.tippS.getTipoprodcarnicoLista().subscribe(response => {
        this.apiTipoprodcarnico = response;
      });

    },
      error => {
        console.log("error while saving data in the DB");
      }
    );
    this.modalReference.close();  //para cerrar
    this._success.next(`Los Datos se GUARDARON Satisfactoriamente..!`);  //para mensaje

  }

  //Modal de Eliminacion Logica 
  llamaModalDel(modal, tipp: Tipoprodcarnico) {
    this.modalReference = this.modalService.open(modal, { centered: true });  
    this.tippI = tipp;
  }

  //Eliminacion Logica 
  onSubmitDel() {
    this.submitted = true;

    this.tippS.deleteTipoprodcarnico(this.tippI.idtipro).subscribe(
      response => {
        console.log("Eliminacion logica correcta");
        // REFERESCA LA LISTA
        this.tippS.getTipoprodcarnicoLista().subscribe(response => {
          this.apiTipoprodcarnico = response;
        });
      },
      error => {
        console.log("Eror al modificar");
      }
    );
    this.modalReference.close();  //para cerrar
  }

  //Modal Habilitar 
  llamaModalHab(modal, tipp: Tipoprodcarnico) {
    //para que la ventana modal se cierre
    this.modalReference = this.modalService.open(modal, { centered: true });  
    this.tippI = tipp;
  }

  //Habilitar 
  onSubmitHab() {
    this.submitted = true;
    this.tippS.habilitarTipoprodcarnico(this.tippI.idtipro).subscribe(
      response => {
        console.log("Habilitacion correcta");
        // REFERESCA LA LISTA
        this.tippS.getTipoprodcarnicoLista().subscribe(response => {
          this.apiTipoprodcarnico = response;
        });

      },
      error => {
        console.log("Eror al modificar");
      }
    );
    this.modalReference.close();  //para cerrar
  }
  //Filtro 
  onChangeFiltroNombre(xnompro: string, xestado: number) {
    this.tippS.getTipoprodcarnicos(xnompro, xestado).subscribe(response => {
      console.log(xestado + "aqui");
      this.apiTipoprodcarnico = response;
    });
  }



}
