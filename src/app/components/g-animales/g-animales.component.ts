import { Component, OnInit, ViewChild } from '@angular/core';
import { DetanimalesComponent } from './detanimales/detanimales.component';
import { Form, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Animales } from 'src/app/model/animales.model';
import { Subject } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AnimalesService } from 'src/app/service/animales.service';
import { Guiasenasag } from 'src/app/model/guiasenasag.model';
import { GuiasenasagService } from 'src/app/service/guiasenasag.service';
import { Tipoanimal } from 'src/app/model/tipoanimal.model';
import { Razas } from 'src/app/model/razas.model';
import { Corrales } from 'src/app/model/corrales.model';
import { CorralesService } from 'src/app/service/corrales.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-g-animales',
  templateUrl: './g-animales.component.html',
  styleUrls: ['./g-animales.component.css']
})
export class GAnimalesComponent implements OnInit {

  @ViewChild(DetanimalesComponent) detalleAnimales: DetanimalesComponent

  form: FormGroup;
  formFiltro: FormGroup;
  submitted = false;

  animalesI: Animales;
  guiasenasagI: Guiasenasag;
  corralesI: Corrales;
  apiAnimales: any;
  apiGuiasenasag: any;
  apiTipoanimal: any;
  apiRazas: any;
  apiCorrales: any;
  apirazas: any[];
  apitipoanimal: any[];


  guiaCtrl = new FormControl(); // Control reactivo para búsqueda
  filteredGuias: any[] = []; // Lista de clientes filtrados

  mostrarListaGuias = false; // Controla si mostrar la lista de sugerencias
  guiaSeleccionada: any; // Cliente seleccionado
  interactuandoConListaGuias = false; // Indica si el usuario está interactuando con la lista

   


  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage: string;
  modalReference: NgbModalRef;
  tipoanimalI: Tipoanimal;
  razasI: Razas;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private aniS: AnimalesService,
    private guiS: GuiasenasagService,
    private corS: CorralesService,
    private datePipe: DatePipe,

  ) {
    this.guiS.getGuiasenasagLista().subscribe(respo => {
      this.apiGuiasenasag = respo;
    });
    this.aniS.getTipoAnimalesLista().subscribe(respo => {
      this.apiTipoanimal = respo;
    });
    this.aniS.getRazasLista().subscribe(respo => {
      this.apiRazas = respo;
    });
    this.aniS.getTipoanimallistas().subscribe((data: Tipoanimal[]) => {
      this.apitipoanimal = data;
      this.cargarTipoanimal();
    });
    this.aniS.getRazaslistas().subscribe((data: Razas[]) => {
      this.apirazas = data;
      //console.log(this.apirazas);
    });
    this.corS.getCorralesLista().subscribe(respo => {
      this.apiCorrales = respo;
    });


  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      feclleg: ['', [Validators.required]],
      edadani: ['', [Validators.required, Validators.min(0)]],
      pesani: ['', [Validators.required, Validators.min(0)]],
      origenani: ['', [Validators.required]],
      sexo: ['', [Validators.required]],
      tipocs: ['', [Validators.required]],
      guiasenasag: ['', [Validators.required]],
      tipoanimal: ['', [Validators.required]],
      razas: ['', [Validators.required]],
      corrales: ['', [Validators.required]],
      

    });
    this.formFiltro = this.formBuilder.group({
      filtro: [''],
      estadosAni: ['-1', [Validators.required]]
    });

  }
  get f() { return this.form.controls; }
  get f2() { return this.formFiltro.controls; }

  cargarTipoanimal() {
    //console.log('La función cargarTipoanimal se ha llamado.');
    const tipoanimalId = this.form.get('tipoanimal').value;
    this.aniS.listarRazasPorTipoAnimal(tipoanimalId).subscribe(respo => {
      this.apiRazas = respo; // Usar una variable separada para las razas
    });
  }

  filtrarGuias(filtro: string): void {
    const filtroTrim = filtro.trim();

    if (filtroTrim === '') {
      this.filteredGuias = [];
      this.mostrarListaGuias = false;
      return;
    }

    this.guiS.buscarPorNroGuia(filtroTrim).subscribe({
      next: (guias) => {
        this.filteredGuias = guias.filter((guia) =>
          guia.nroguia.toString().includes(filtroTrim)
        );
        this.mostrarListaGuias = this.filteredGuias.length > 0;
      },
      error: (error) => {
        console.error('Error al buscar guías:', error);
        this.filteredGuias = [];
        this.mostrarListaGuias = false;
      }
    });
  }

  seleccionarGuia(guia: any): void {
    this.guiaSeleccionada = guia;
    this.guiaCtrl.setValue(`${guia.nroguia}`);
    this.mostrarListaGuias = false;
  }

  ocultarListaGuias(): void {
    if (!this.interactuandoConListaGuias) {
      this.mostrarListaGuias = false;
    }
  }





  llamaModalAdd(modal) {
    this.submitted = false;
    const fechaActual = new Date();
    const fechaFormateada = this.datePipe.transform(fechaActual, 'yyyy-MM-dd'); // Formato de fecha

    // Inicializar valores del formulario
    this.form.reset({
      feclleg: fechaFormateada, // Asignar fecha actual
      edadani: '', pesani: '', origenani: '', sexo: '', tipocs: '', guiasenasag: '',
      tipoanimal: '', razas: '', corrales: ''
    });

    // Abrir el modal centrado
    this.modalReference = this.modalService.open(modal, {
      size: 'lg',
      centered: true // Esto asegura que el modal se centre en la pantalla
    });
  }



  filtrarNombre(): void {
    const filtro = this.formFiltro.value.filtro;
    const estadosAni = this.formFiltro.value.estadosAni;
    console.log("filtrar..");
    this.detalleAnimales.onChangeFiltroNombre(filtro, estadosAni);

    this.aniS.getCliListaRazsoc(filtro, estadosAni).subscribe(respon => {
      this.apiCorrales = respon;
    });
  }


  onSubmit() {
    this.submitted = true;
    if ((this.form.invalid) == true) {
      return;
    }
    for (let i = 0; i < this.apiGuiasenasag.length; i++) {
      if (this.form.controls.guiasenasag.value == this.apiGuiasenasag[i].idguisen) {
        this.guiasenasagI = this.apiGuiasenasag[i];
      }
    }
    for (let i = 0; i < this.apiTipoanimal.length; i++) {
      if (this.form.controls.tipoanimal.value == this.apiTipoanimal[i].idtip) {
        this.tipoanimalI = this.apiTipoanimal[i];
      }
    }
    for (let i = 0; i < this.apiRazas.length; i++) {
      if (this.form.controls.razas.value == this.apiRazas[i].idraz) {
        this.razasI = this.apiRazas[i];
      }
    }
    for (let i = 0; i < this.apiCorrales.length; i++) {
      if (this.form.controls.corrales.value == this.apiCorrales[i].idcorral) {
        this.corralesI = this.apiCorrales[i];
      }
    }


    this.animalesI = {
      idani: 0,
      feclleg: (this.form.controls.feclleg.value),
      edadani: (this.form.controls.edadani.value),
      pesani: (this.form.controls.pesani.value),
      origenani: (this.form.controls.origenani.value),
      sexo: (this.form.controls.sexo.value),
      tipocs: (this.form.controls.tipocs.value),
      canani: 1,
      estado: 1,
      guiasenasag: this.guiasenasagI,
      tipoanimal: this.tipoanimalI,
      razas: this.razasI,
      corrales: this.corralesI,

    }
    this.aniS.saveAnimales(this.animalesI).subscribe(response => {
      this.detalleAnimales.listarAnimal();
    },
      error => {
        console.log("error while saving data in the DB");
        this.formFiltro.controls.filtro.setValue('');
        this.formFiltro.controls.estadosAni.setValue('-1');
        this.detalleAnimales.onChangeFiltroNombre('', -1);
      }
    );
    this.modalReference.close();  //para cerrar
    this._success.next(`Los Datos se GUARDARON Satisfactoriamente..!`);  //para mensaje
  }
}



