import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { Clientes } from 'src/app/model/clientes.model';
import { ClientesService } from 'src/app/service/clientes.service';
import { DetclientesComponent } from './detclientes/detclientes.component';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-g-clientes',
  templateUrl: './g-clientes.component.html',
  styleUrls: ['./g-clientes.component.css']
})
export class GClientesComponent implements OnInit {

  @ViewChild(DetclientesComponent) detalleClientes: DetclientesComponent

  form: FormGroup;
  formFiltro: FormGroup;
  submitted = false;
  clientesI: Clientes;
  apiClientes: any;

  

  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage: string;
  modalReference: NgbModalRef;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private clientesService: ClientesService,

  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      tipcli: ['', [Validators.required]],
      nomcli: ['', [Validators.required]],
      nit: ['', [Validators.required]],
      nompro: ['', [Validators.required]],
      nommer: ['', [Validators.minLength(5), Validators.maxLength(30)]],
      numlocal: ['', [Validators.minLength(1), Validators.maxLength(10)]],
      telecli: ['', [Validators.required]],
      direcli: ['', [Validators.required]],

    });
    this.formFiltro = this.formBuilder.group({
      filtro: [''],
      estadosCli: ['-1', [Validators.required]]
    });

    this.form.get('tipcli').valueChanges.subscribe(value => {
      if (value === 'M') {
        this.form.get('nommer').setValidators([Validators.required, Validators.minLength(5), Validators.maxLength(30)]);
        this.form.get('numlocal').setValidators([Validators.required, Validators.minLength(1), Validators.maxLength(10)]);
      } else {
        this.form.get('nommer').clearValidators();
        this.form.get('numlocal').clearValidators();
      }
      this.form.get('nommer').updateValueAndValidity();
      this.form.get('numlocal').updateValueAndValidity();
    });


    // Configure the success message observable
    this._success.subscribe(message => this.successMessage = message);
    this._success.pipe(debounceTime(5000)).subscribe(() => this.successMessage = null);
  }



  get f() { return this.form.controls; }
  get f2() { return this.formFiltro.controls; }

  llamaModalAdd(modal) {
    this.submitted = false;
    //inicializar valores del formulario
    this.form.reset([{ tipcli: '' }, { nomcli: '' }, { nit: '' }, { nompro: '' }, { nommer: '' }, { numlocal: '' }, { telecli: '' }, { direcli: '' }]);
    //para que la ventana modal se cierre
    this.modalReference = this.modalService.open(modal, { centered: true });  

  }


  filtrarNombre(): void {
    const filtro = this.formFiltro.value.filtro.toUpperCase();
    const estadosCli = this.formFiltro.value.estadosCli;
    console.log("filtrar..");
    this.detalleClientes.onChangeFiltroNombre(filtro, estadosCli);

    this.clientesService.getCliListaRazsoc(filtro,  estadosCli). subscribe(respon =>{
      this.apiClientes = respon;
    });

    
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
  
    // Crear el objeto clientesI basado en los valores del formulario
    this.clientesI = {
      idcli: 0,
      tipcli: this.f.tipcli.value.toUpperCase(),
      nomcli: this.f.nomcli.value.toUpperCase(),
      nit: this.f.nit.value,
      nompro: this.f.nompro.value.toUpperCase(),
      nommer: this.f.tipcli.value === 'M' ? this.f.nommer.value : null,
      numlocal: this.f.tipcli.value === 'M' ? this.f.numlocal.value : null,
      telecli: this.f.telecli.value,
      direcli: this.f.direcli.value.toUpperCase(),
      estado: 1,
    };
  
    // Llamar al servicio para guardar los datos del cliente
    this.clientesService.saveClientes(this.clientesI).subscribe(
      response => {
        console.log("Datos guardados satisfactoriamente", response);
        this.formFiltro.controls.filtro.setValue('');
        this.formFiltro.controls.estadosCli.setValue('-1');
        this.detalleClientes.onChangeFiltroNombre('', -1);
        this._success.next(`Los Datos se GUARDARON Satisfactoriamente..!`);
        this.hideSuccessMessage();
      },
      error => {
        console.log("Error al guardar datos en la base de datos", error);
        this._success.next(`Error al guardar datos en la base de datos`);
        this.hideSuccessMessage();
      }
    );
  
    this.modalReference.close();  // Para cerrar el modal
  }
  
  
  hideSuccessMessage() {
    setTimeout(() => {
      this.successMessage = null;
    }, 5000); // 5000 milisegundos = 5 segundos
  }


}


