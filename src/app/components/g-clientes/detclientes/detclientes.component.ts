import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { Clientes } from 'src/app/model/clientes.model';
import { ClientesService } from 'src/app/service/clientes.service';

@Component({
  selector: 'app-detclientes',
  templateUrl: './detclientes.component.html',
  styleUrls: ['./detclientes.component.css']
})
export class DetclientesComponent implements OnInit {

  apiClientes: any;
  index = 0;
  submitted = false;
  form: FormGroup;
  clientesI: Clientes;
  pageActual: number = 1;

  private _success = new Subject<string>(); //para mensaje
  staticAlertClosed = false;  //para mensaje
  successMessage: string;  //para mensaje
  modalReference: NgbModalRef;  //para mensaje

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private clientesService: ClientesService,
  ) {
    this.clientesService.getClientesLista().subscribe(response => {
      this.apiClientes = response;
    });
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      tipcli: ['', [Validators.required]],
      nomcli: ['', [Validators.required]],
      nit: ['', [Validators.required]],
      nompro: ['', [Validators.required]],
      nommer: [''],
      numlocal: [''],
      telecli: ['', [Validators.required]],
      direcli: ['', [Validators.required]],
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
  }
  get f() { return this.form.controls; }

  llamaModalMod(modal, cli: Clientes) {
    this.submitted = false;
    // Inicializar valores del formulario
    const formValues = {
      tipcli: cli.tipcli,
      nomcli: cli.nomcli,
      nit: cli.nit,
      nompro: cli.nompro,
      telecli: cli.telecli,
      direcli: cli.direcli,
      nommer : cli.nommer, 
      numlocal: cli.numlocal
    };
  

    this.form.reset(formValues);
    // Para que la ventana modal se cierre
    this.modalReference = this.modalService.open(modal, { centered: true });  
    this.index = cli.idcli;
  }
  

  onSubmit() {
    this.submitted = true;
    if ((this.form.invalid) == true) {
      return;
    }
    this.clientesI = {
      idcli       : 0,
      tipcli      : this.f.tipcli.value.toUpperCase(),
      nomcli      : this.f.nomcli.value.toUpperCase(),
      nit         : this.f.nit.value,
      nompro      : this.f.nompro.value.toUpperCase(),
      nommer: this.f.tipcli.value === 'M' ? this.f.nommer.value : null,
      numlocal: this.f.tipcli.value === 'M' ? this.f.numlocal.value : null,
      telecli 	  : this.f.telecli.value,
      direcli 	  : this.f.direcli.value.toUpperCase(),
      estado		  : 1,
    }
    this.clientesService.modificarClientes(this.index, this.clientesI).subscribe(response => {
      this.clientesService.getClientesLista().subscribe(response => {
        this.apiClientes = response;

      });
    },
      error => {
        console.log("error while saving data in the DB");
      }
    );
    this.modalReference.close();  //para cerrar
    this._success.next(`Los Datos se GUARDARON Satisfactoriamente..!`);  //para mensaje
  }
  llamaModalDel(modal, cli: Clientes) {
    //para que la ventana modal se cierre
    this.modalReference = this.modalService.open(modal, { centered: true });  
    this.clientesI = cli;
  }

  onSubmitDel() {
    this.submitted = true;
    this.clientesService.deleteClientes(this.clientesI.idcli).subscribe(
      response => {
        console.log("Eliminacion logica correcta");
        // REFERESCA LA LISTA
        this.clientesService.getClientesLista().subscribe(response => {
          this.apiClientes = response;

        });

      },
      error => {
        console.log("Eror al modificar");
      }
    );
    this.modalReference.close();  //para cerrar
  }
  //modal Habilitar 
  llamaModalHab(modal, cli: Clientes) {
    //para que la ventana modal se cierre
    this.modalReference = this.modalService.open(modal, { centered: true });  
    this.clientesI = cli;
  }

  onSubmitHab() {
    this.submitted = true;
    this.clientesService.habilitarClientes(this.clientesI.idcli).subscribe(
      response => {
        console.log("Habilitacion correcta");
        // REFERESCA LA LISTA
        this.clientesService.getClientesLista().subscribe(response => {
          this.apiClientes = response;

        });

      },
      error => {
        console.log("Eror al modificar");
      }
    );
    this.modalReference.close();  //para cerrar
  }


  //filtro
  onChangeFiltroNombre(xnomcli: string, xestado: number) {
    this.clientesService.getCliListaRazsoc(xnomcli, xestado).subscribe(response => {
      console.log(xestado + "aqui");
      this.apiClientes = response;
    });
  }

}
