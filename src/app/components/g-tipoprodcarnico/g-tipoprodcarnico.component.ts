import { Component, OnInit, ViewChild } from '@angular/core';
import { DettipoprodcarnicoComponent } from './dettipoprodcarnico/dettipoprodcarnico.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tipoprodcarnico } from 'src/app/model/tipoprodcarnico.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TipoprodcarnicoService } from 'src/app/service/tipoprodcarnico.service';
import { Tipoanimal } from 'src/app/model/tipoanimal.model';
import { AnimalesService } from 'src/app/service/animales.service';

@Component({
  selector: 'app-g-tipoprodcarnico',
  templateUrl: './g-tipoprodcarnico.component.html',
  styleUrls: ['./g-tipoprodcarnico.component.css']
})
export class GTipoprodcarnicoComponent implements OnInit {

  @ViewChild(DettipoprodcarnicoComponent) detalleTipoprodcarnico: DettipoprodcarnicoComponent

  form: FormGroup;
  formFiltro: FormGroup;
  submitted = false;
  tippI: Tipoprodcarnico;
  apiTipoprodcarnico: any;
  tipoanimalI: Tipoanimal;
  apiTipoanimal: any;

  modalReference: NgbModalRef;


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
      despro: [''],
      tipoanimal: ['', [Validators.required]],

    });
    this.formFiltro = this.formBuilder.group({
      filtro: [''],
      estadosTipp: ['-1', [Validators.required]]
    });
  }

  get f() { return this.form.controls; }
  get f2() { return this.formFiltro.controls; }

  llamaModalAdd(modal) {
    this.submitted = false;
    this.form.reset([{ nompro: '' }, { tipo: '' }, { despro: '' }]);
    this.modalReference = this.modalService.open(modal, { centered: true });
  }

  filtrarNombre(): void {
    const filtro = this.formFiltro.value.filtro.toUpperCase();
    const estadosTipp = this.formFiltro.value.estadosTipp;
    console.log("filtrar..");
    this.detalleTipoprodcarnico.onChangeFiltroNombre(filtro, estadosTipp);

    this.tippS.getTipoprodcarnicos(filtro, estadosTipp).subscribe(respon => {
      this.apiTipoprodcarnico = respon;
    });
  }

  //adicionar empleado
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
      despro: this.form.controls.despro.value
        ? this.form.controls.despro.value.toUpperCase()
        : '',
      estado: 1,
      tipoanimal: this.tipoanimalI,
    }


    this.tippS.saveTipoprodcarnico(this.tippI).subscribe(response => {
      this.detalleTipoprodcarnico.listarTipoprodcarnicos();

    },
      error => {
        console.log("error while saving data in the DB");
        this.formFiltro.controls.filtro.setValue('');
        this.formFiltro.controls.estadoTipp.setValue('-1');
        this.detalleTipoprodcarnico.onChangeFiltroNombre('', -1);
      }
    );

    this.modalReference.close();

  }


}
