import { Component, OnInit, ViewChild } from '@angular/core';
import { DetentregaprodcComponent } from './detentregaprodc/detentregaprodc.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Entregaprodc } from 'src/app/model/entregaprodc.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { EntregaprodcService } from 'src/app/service/entregaprodc.service';

import { CamaraService } from 'src/app/service/camara.service';
import { Camara } from 'src/app/model/camara.model';
import { ProdCarnicos } from 'src/app/model/prodcarnicos.model';
import { ProdcarnicosService } from 'src/app/service/prodcarnicos.service';

@Component({
  selector: 'app-g-entregaprodc',
  templateUrl: './g-entregaprodc.component.html',
  styleUrls: ['./g-entregaprodc.component.css']
})
export class GEntregaprodcComponent implements OnInit {

  @ViewChild ( DetentregaprodcComponent) detalleEntregaprodc : DetentregaprodcComponent

  form : FormGroup;
  formFiltro: FormGroup;
  submitted = false;

  EntprdcI : Entregaprodc;
  apiEntprdc : any;

  camaraI : Camara;
  apiCamara : any;

  prodcarnicosI : ProdCarnicos ;
  apiProdcarnicos : any;

  apiprodcarnicos : any[] = [];

  private _success  = new Subject<string>(); 
  staticAlertClosed = false;  
  successMessage    : string;  
  modalReference    : NgbModalRef;

  constructor(
    private modalService : NgbModal,
    private formBuilder  : FormBuilder,
    private entprdcS     : EntregaprodcService,
    private camS: CamaraService,
    private prdcS        : ProdcarnicosService,
  ) { 
    this.camS.getCamaraLista().subscribe(respon => {
      this.apiCamara = respon;
    });
    this.prdcS.getProduCarnicosLista().subscribe( respon=>{
      this.apiProdcarnicos = respon;
    });
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({ 
      fecent      : ['', [Validators.required]],
      dirent      : ['', [Validators.required]],
      pesent      : ['', [Validators.required, Validators.min(0)]],
      camara      : ['', [Validators.required]],
      prodcarnicos : ['', [Validators.required]],

      
      });
      this.formFiltro = this.formBuilder.group({
        filtro: [''],
        estadosEnt : ['-1', [Validators.required]]
      });

      this.prdcS.getProdcLisA().subscribe((data: ProdCarnicos[]) => {
        this.apiprodcarnicos   = data;
      });
        // Cargar todos los productos cárnicos
  this.prdcS.getProdcLisA().subscribe((data: ProdCarnicos[]) => {
    // Filtrar productos cárnicos con estado 1
    this.apiProdcarnicos = data.filter(prod => prod.estado === 1);
  });

  }

  get f(){ return this.form.controls;}
  get f2() { return this.formFiltro.controls;}

  onProdcChange() {
    const selectedProdcId = parseInt(this.form.get('prodcarnicos').value, 10);
    const selectedProdcarnicos = this.apiProdcarnicos.find( prod => prod.idprod === selectedProdcId);
    if (selectedProdcarnicos) {
      this.form.get('pesent').setValue(selectedProdcarnicos.pesotot);
    } else {
      this.form.get('pesent').setValue('');
    }
  }

  onCamChange() {
    const selectedCamId = parseInt(this.form.get('prodcarnicos').value);
    const selectedCamara = this.apiProdcarnicos.find( prod => prod.idprod === selectedCamId);
    if (selectedCamara) {
      this.form.get('camara').setValue(selectedCamara.camara);
    } else {
      this.form.get('camara').setValue('');
    }
  }

  llamaModalAdd(modal){
    this.submitted = false;
    this.form.reset([{fecent : '', dirent  : '', pesent : ''}]);
    this.modalReference = this.modalService.open(modal);  
  }

  filtrarNombre(): void {
    const filtro = this.formFiltro.value.filtro;
    const estadosEnt = this.formFiltro.value.estadosEnt;
    console.log("filtrar..");
    this.detalleEntregaprodc.onChangeFiltroNombre(filtro, estadosEnt);

    this.entprdcS.getEntprdcDirent(filtro, estadosEnt). subscribe(respon =>{
      this.apiEntprdc = respon;
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
        return;
    }  

    // Obtener la cámara seleccionada
    for (let i = 0; i < this.apiCamara.length; i++) {
        if (this.form.controls.camara.value == this.apiCamara[i].idcamfri) {
            this.camaraI = this.apiCamara[i];
            break; // Sale del bucle una vez que encuentra la cámara
        }
    }

    // Obtener el producto cárnico seleccionado
    for (let i = 0; i < this.apiProdcarnicos.length; i++) {
        if (this.form.controls.prodcarnicos.value == this.apiProdcarnicos[i].idprod) {
            this.prodcarnicosI = this.apiProdcarnicos[i];
            break; // Sale del bucle una vez que encuentra el producto
        }
    }

    // Crear el objeto de entrega
    this.EntprdcI = {
        identpro: 0,
        fecent: (this.form.controls.fecent.value).toUpperCase(),
        dirent: (this.form.controls.dirent.value).toUpperCase(),
        pesent: this.form.controls.pesent.value,
        estado: 1,
        camara: this.camaraI,
        prodcarnicos: this.prodcarnicosI,
    };

    // Guardar la entrega en la base de datos
    this.entprdcS.saveEntprdc(this.EntprdcI).subscribe(response => {
        // Actualizar el saldo en la tabla de cámara
        const pesent = this.form.controls.pesent.value; // Peso entregado
        const canting = this.camaraI.canting; // Cantidad ingresada actual

        const nuevoCanting = canting - pesent; // Restar pesent de canting
        const saldo = this.camaraI.capcam - nuevoCanting; // Calcular el saldo de la cámara

        // Actualizar la cámara en la base de datos (solo enviando canting y saldo)
        const updatedCamara = {
            canting: nuevoCanting,
            saldo: saldo
        };

        this.prdcS.updateCamaraSal(this.camaraI.idcamfri, updatedCamara).subscribe(camResponse => {
            // Ahora, cambiar el estado del producto cárnico a 0 (inactivo o entregado)
            this.prodcarnicosI.estado = 0;

            this.prdcS.updateProdCarnicoEstado(this.prodcarnicosI.idprod, this.prodcarnicosI).subscribe(prodResponse => {
                this.detalleEntregaprodc.listarEntprdc();
                this.modalReference.close(); // Cerrar el modal
            });
        });
    },  
    error => {  
        console.log("Error while saving data in the DB"); 
        this.formFiltro.controls.filtro.setValue('');
        this.formFiltro.controls.estadosEnt.setValue('-1');
        this.detalleEntregaprodc.onChangeFiltroNombre('', -1);
    }); 
}

}
