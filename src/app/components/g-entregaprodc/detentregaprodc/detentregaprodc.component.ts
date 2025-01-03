import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Camara } from 'src/app/model/camara.model';
import { Entregaprodc } from 'src/app/model/entregaprodc.model';
import { ProdCarnicos } from 'src/app/model/prodcarnicos.model';
import { CamaraService } from 'src/app/service/camara.service';
import { EntregaprodcService } from 'src/app/service/entregaprodc.service';
import { ProdcarnicosService } from 'src/app/service/prodcarnicos.service';

@Component({
  selector: 'app-detentregaprodc',
  templateUrl: './detentregaprodc.component.html',
  styleUrls: ['./detentregaprodc.component.css']
})
export class DetentregaprodcComponent implements OnInit {

  form: FormGroup;
  pageActual: number = 1;
  submitted = false;
  index = 0;

  EntprdcI: Entregaprodc;
  apiEntprdc: any;

  modalReference: NgbModalRef;


  camaraI: Camara;
  apiCamara: any;

  prodcarnicosI: ProdCarnicos;
  apiProdcarnicos: any;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private entprdcS: EntregaprodcService,
    private camS: CamaraService,
    private prdcS: ProdcarnicosService,
  ) {
    this.entprdcS.getEntprdcLista().subscribe(respo => {
      this.apiEntprdc = respo;
    });
    this.camS.getCamaraLista().subscribe(respon => {
      this.apiCamara = respon;
    });
    this.prdcS.getProduCarnicosLista().subscribe(respon => {
      this.apiProdcarnicos = respon;
    });
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      fecent: ['', [Validators.required]],
      dirent: ['', [Validators.required]],
      pesent: ['', [Validators.required]],
      camara: ['', [Validators.required]],
      prodcarnicos: ['', [Validators.required]],

    });

    // Cargar todos los productos cárnicos
    this.prdcS.getProdcLisA().subscribe((data: ProdCarnicos[]) => {
      // Filtrar productos cárnicos con estado 1
      this.apiProdcarnicos = data.filter(prod => prod.estado === 1);
    });
  }

  get f() { return this.form.controls; }

  listarEntprdc() {
    this.entprdcS.getEntprdcLista().subscribe(respon => {
      this.apiEntprdc = respon;
    });
  }

  onProdcChange() {
    const selectedProdcId = parseInt(this.form.get('prodcarnicos').value, 10);
    const selectedProdcarnicos = this.apiProdcarnicos.find(prod => prod.idprod === selectedProdcId);
    if (selectedProdcarnicos) {
      this.form.get('pesent').setValue(selectedProdcarnicos.pesotot);
    } else {
      this.form.get('pesent').setValue('');
    }
  }

  onCamChange() {
    const selectedCamId = parseInt(this.form.get('prodcarnicos').value);
    const selectedCamara = this.apiProdcarnicos.find(prod => prod.idprod === selectedCamId);
    if (selectedCamara) {
      this.form.get('camara').setValue(selectedCamara.camara);
    } else {
      this.form.get('camara').setValue('');
    }
  }


  llamaModalMod(modal, entprdc: Entregaprodc) {
    this.submitted = false;
    this.form.reset({ fecent: entprdc.fecent, dirent: entprdc.dirent, pesent: entprdc.pesent, camara: entprdc.camara.idcamfri, prodcarnicos: entprdc.prodcarnicos.idprod });
    this.modalReference = this.modalService.open(modal);
    this.index = entprdc.identpro;
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
        return;
    }

    let camaraCambiada = false;
    let prodcarnicosCambiado = false;

    // Obtener la cámara seleccionada y verificar si ha sido modificada
    for (let i = 0; i < this.apiCamara.length; i++) {
        if (this.form.controls.camara.value == this.apiCamara[i].idcamfri) {
            if (!this.camaraI || this.camaraI.idcamfri !== this.apiCamara[i].idcamfri) {
                camaraCambiada = true;
            }
            this.camaraI = this.apiCamara[i];
            break;
        }
    }

    // Obtener el producto cárnico seleccionado y verificar si ha sido modificado
    for (let i = 0; i < this.apiProdcarnicos.length; i++) {
        if (this.form.controls.prodcarnicos.value == this.apiProdcarnicos[i].idprod) {
            if (!this.prodcarnicosI || this.prodcarnicosI.idprod !== this.apiProdcarnicos[i].idprod) {
                prodcarnicosCambiado = true;
            }
            this.prodcarnicosI = this.apiProdcarnicos[i];
            break;
        }
    }

    // Obtener el peso anterior
    const pesoAnterior = this.EntprdcI ? this.EntprdcI.pesent : 0;

    // Crear el objeto de entrega con los nuevos datos
    this.EntprdcI = {
        identpro: this.index, // Identificador de la entrega existente
        fecent: this.form.controls.fecent.value.toUpperCase(),
        dirent: this.form.controls.dirent.value.toUpperCase(),
        pesent: this.form.controls.pesent.value, // Nuevo peso
        estado: 1,
        camara: this.camaraI,
        prodcarnicos: this.prodcarnicosI,
    };

    // Realizar la modificación de la entrega
    this.entprdcS.modificarEntprdc(this.index, this.EntprdcI).subscribe(response => {
        const nuevoPeso = this.form.controls.pesent.value; // El nuevo peso ingresado
        let cantingActual = this.camaraI.canting; // Cantidad ingresada actual de la cámara

        // Si se ha cambiado el producto cárnico
        if (prodcarnicosCambiado) {
            // Reponer el peso anterior al canting actual
            cantingActual += pesoAnterior; // Agregar el peso anterior

            // Restar el nuevo peso actual
            cantingActual -= nuevoPeso;

            // Asegurarse de que el canting no sea negativo
            if (cantingActual < 0) {
                cantingActual = 0; // o manejar el error según sea necesario
            }
        }

        // Si se ha cambiado la cámara
        if (camaraCambiada) {
            // Si se cambia la cámara, primero se debería sumar el peso anterior
            cantingActual += pesoAnterior; // Reponer peso anterior (esto también puede ser necesario)
            // Aquí podrías considerar también la lógica para manejar el cambio de cámara si lo deseas
        }

        // Calcular el nuevo saldo de la cámara
        const saldo = this.camaraI.capcam - cantingActual;

        // Actualizar la cámara en la base de datos
        const updatedCamara = {
            canting: cantingActual,
            saldo: saldo,
        };

        this.prdcS.updateCamaraSal(this.camaraI.idcamfri, updatedCamara).subscribe(camResponse => {
            console.log('Cámara actualizada correctamente');
        });

        // Si se cambió el producto cárnico, actualizar su estado
        if (prodcarnicosCambiado) {
            this.prodcarnicosI.estado = 1;

            // Actualizar el estado del producto cárnico en la base de datos
            this.prdcS.updateProdCarnicoEstado(this.prodcarnicosI.idprod, this.prodcarnicosI).subscribe(prodResponse => {
                console.log('Producto cárnico actualizado correctamente');
            });
        }

        // Actualizar la lista de entregas después de la modificación
        this.entprdcS.getEntprdcLista().subscribe(respon => {
            this.apiEntprdc = respon;
            this.modalReference.close();
        });
    },
    error => {
        console.log("Error while saving data in the DB");
    });
}


  llamaModalDel(modal, entprdc: Entregaprodc) {
    this.modalReference = this.modalService.open(modal);
    this.EntprdcI = entprdc;
  }

  onSubmitDel() {
    this.submitted = true;
    this.entprdcS.deleteEntprdc(this.EntprdcI.identpro).subscribe(
      response => {
        console.log("Eliminacion logica correcta");
        // REFERESCA LA LISTA
        this.entprdcS.getEntprdcLista().subscribe(respon => {
          this.apiEntprdc = respon;
        });

      },
      error => {
        console.log("Eror al modificar");
      }
    );
    this.modalReference.close();  //para cerrar
  }

  llamaModalHab(modal, entprdc: Entregaprodc) {
    //para que la ventana modal se cierre
    this.modalReference = this.modalService.open(modal);
    this.EntprdcI = entprdc;
  }

  onSubmitHab() {
    this.submitted = true;
    this.entprdcS.habilitarEntprdc(this.EntprdcI.identpro).subscribe(
      response => {
        console.log("Habilitacion correcta");
        // REFERESCA LA LISTA
        this.entprdcS.getEntprdcLista().subscribe(respon => {
          this.apiEntprdc = respon;
        });

      },
      error => {
        console.log("Eror al modificar");
      }
    );
    this.modalReference.close();  //para cerrar
  }


  //filtro
  onChangeFiltroNombre(xdirent: string, xestado: number) {
    this.entprdcS.getEntprdcDirent(xdirent, xestado).subscribe(response => {
      console.log(xestado + "aqui");
      this.apiEntprdc = response;
    });
  }

}
