import { Component, OnInit, ViewChild } from '@angular/core';
import { DetprodcarnicosComponent } from './detprodcarnicos/detprodcarnicos.component';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Detprodcartemp, ProdCarnicos } from 'src/app/model/prodcarnicos.model';
import { ProdcarnicosService } from 'src/app/service/prodcarnicos.service';
import { Tipoanimal } from 'src/app/model/tipoanimal.model';
import { AnimalesService } from 'src/app/service/animales.service';
import { Tipoprodcarnico } from 'src/app/model/tipoprodcarnico.model';
import { Camara } from 'src/app/model/camara.model';
import { Detserviciofaena, Serviciofaena } from 'src/app/model/serviciofaena.model';
import { CamaraService } from 'src/app/service/camara.service';
import { TipoprodcarnicoService } from 'src/app/service/tipoprodcarnico.service';
import { ServiciofaenaService } from 'src/app/service/serviciofaena.service';
import { Clientes } from 'src/app/model/clientes.model';
import { ClientesService } from 'src/app/service/clientes.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-g-prodcarnicos',
  templateUrl: './g-prodcarnicos.component.html',
  styleUrls: ['./g-prodcarnicos.component.css']
})
export class GProdcarnicosComponent implements OnInit {

  @ViewChild(DetprodcarnicosComponent) detalleProdcarnicos: DetprodcarnicosComponent

  form: FormGroup;
  formdet: FormGroup;
  formFiltro: FormGroup;
  submitted = false;
  total = 0;
  clientesI: Clientes;

  prdcI: ProdCarnicos;
  detprodcI: Detprodcartemp;

  tipoanimalI: Tipoanimal;
  tipoprodcarnicoI: Tipoprodcarnico;
  camaraI: Camara;
  serviciofaenaI: Serviciofaena;
  detserviciofaenaI: Detserviciofaena;

  apiTipoprodcarnico: any;
  apiCamara: any;
  apiServiciofaena: any;
  apiClientes: any;
  apiDetserviciofaena: any;
  apiDetprdctemp: any;
  apiDetprodc: any;
  apidetprodc: any[] = [];
  filteredDetserviciofaena: any[] = [];
  selectedTipoAnimalId: number | null = null; // Para guardar el ID del tipo de animal seleccionado

  filteredTipoprodcarnico: Tipoprodcarnico[] = []; // Tipos de productos cárnicos filtrados por tipo de animal
  filteredCamara: Camara[] = [];  // Nueva variable para almacenar las cámaras filtradas

  apiTipoanimal: any;
  apiProdcarnicos: any;

  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage: string;
  modalReference: NgbModalRef;
  modalReference2: NgbModalRef;

  clienteCtrl = new FormControl(); // Control reactivo para búsqueda de clientes
  filteredClientes: any[] = []; // Lista de clientes filtrados
  mostrarLista = false; // Controla si mostrar la lista de sugerencias
  clienteSeleccionado: any; // Cliente seleccionado
  interactuandoConLista = false; 


  constructor(
    private prdcS: ProdcarnicosService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private aniS: AnimalesService,
    private camS: CamaraService,
    private tippS: TipoprodcarnicoService,
    private serfaS: ServiciofaenaService,
    private cliS: ClientesService,
  ) {

      // Escucha cambios en el input para realizar el filtrado automáticamente
      this.clienteCtrl.valueChanges.subscribe(value => {
        if (value && value.length > 1) { // Filtra solo si hay más de un carácter
          this.filtrarClientes(value);
        } else {
          this.filteredClientes = [];
        }
      });
    this.cliS.getClientesLista().subscribe(respon => {
      this.apiClientes = respon;
    });
    this.aniS.getTipoAnimalesLista().subscribe((respo) => {
      this.apiTipoanimal = respo;
    });
    this.camS.getCamaraLista().subscribe(respon => {
      this.apiCamara = respon;
    });
    this.tippS.getTipoprodcarnicoLista().subscribe(response => {
      this.apiTipoprodcarnico = response;
    });
    this.serfaS.getServiciofaenaLista().subscribe(response => {
      this.apiServiciofaena = response;
    });
    this.serfaS.getDetserfaLista().subscribe(response => {
      this.apiDetserviciofaena = response;
    });

    this.prdcS.eliminarDetprodcartemptodo(1).subscribe(respon => { });
    this.actualizarlistatemp();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      fechaing: ['', [Validators.required, this.todayValidator()]],
      pesotot: [''],
      clientes: ['', [Validators.required]],
      obserpro: [''],

    });
    this.formFiltro = this.formBuilder.group({
      filtro: [''],
      estadosPrdc: ['-1', [Validators.required]],

    });
    this.formdet = this.formBuilder.group({
      pesoing: ['', [Validators.required, Validators.min(0)]],
      tipoanimal: [{ value: '', disabled: true }],
      tipoprodcarnico: ['', [Validators.required]],
      camara: ['', [Validators.required]],
      serviciofaena: ['', [Validators.required]],
      detserviciofaena: ['', [Validators.required]],

    });

    this.prdcS.getdetprodcarLista().subscribe((data: any[]) => {
      this.apiDetprodc = data;
      console.log(this.apiDetprodc);
    });

    this.prdcS.getDetprodcarListatemp().subscribe(respo => {
      this.apiDetprdctemp = respo;
    });
  }

  get f() { return this.form.controls; }
  get f2() { return this.formFiltro.controls; }
  get f3() { return this.formdet.controls; }

  filtrarNombre(): void {
    const filtro = this.formFiltro.value.filtro.toUpperCase();
    const estadosPrdc = this.formFiltro.value.estadosPrdc;
    console.log("filtrar..");
    this.detalleProdcarnicos.onChangeFiltroNombre(filtro, estadosPrdc);

    this.prdcS.getProdcarnicosListaNombres(filtro, estadosPrdc).subscribe(respon => {
      this.apiProdcarnicos = respon;
    });
  }

  todayValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const today = new Date().toISOString().split('T')[0];
      return control.value === today ? null : { dateNotToday: true };
    };
  }

    /*buscar por cliente  */
    filtrarClientes(filtro: string): void {
      this.serfaS.buscarClientes(filtro).subscribe(clientes => {
        this.filteredClientes = clientes; // Actualiza la lista de clientes filtrados
        this.mostrarLista = true; // Asegura que la lista se muestre después de filtrar
      });
    }
    
    seleccionarCliente(cliente: any): void {
      this.clienteSeleccionado = cliente; // Guarda el cliente seleccionado
      this.form.controls['clientes'].setValue(cliente.idcli); // Asigna el ID al formulario
      this.clienteCtrl.setValue(`${cliente.nomcli} - ${cliente.nit}`); // Muestra el cliente seleccionado en el input
      this.mostrarLista = false; // Oculta la lista después de seleccionar un cliente
    }
    
    ocultarLista(): void {
      if (!this.interactuandoConLista) {
        // Solo oculta la lista si no se está interactuando con ella
        this.mostrarLista = false;
      }
    }

  llamaModalAdd(modal) {
    this.submitted = false;
    const today = new Date();
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];
    this.form.patchValue({
      fechaing: localDate, impser: '', pesotot: '', clientes: '', obserpro: ''
    });

    // Limpiar datos temporales antes de abrir el modal
    this.prdcS.eliminarDetprodcartemptodo(1).subscribe(() => {
      this.actualizarlistatemp();  // actualizar la lista temporal después de limpiar
      this.total = 0; // resetear total

      // Retrasar la apertura del modal para asegurar que el formulario se actualice
      setTimeout(() => {
        this.modalReference = this.modalService.open(modal, { size: 'lg', centered: true });
      }, 0);
    });
  }

  cancelar() {
    this.modalReference.close();  // Cierra el modal
    this.prdcS.eliminarDetprodcartemptodo(1).subscribe(resp => {
      //this.actualizarlistatemp();  // Actualiza la lista temporal después de cerrar
      this.total = 0;
    });
  }
  compraLast: any;
  idcomaux: number;


  // Adicionar un producto cárnico
  onSubmit() {
    this.submitted = true;

    // Verificar si el formulario es inválido
    if (this.form.invalid) {
      return;
    }

    // Encontrar el cliente seleccionado en la lista
    for (let i = 0; i < this.apiClientes.length; i++) {
      if (this.form.controls.clientes.value == this.apiClientes[i].idcli) {
        this.clientesI = this.apiClientes[i];
      }
    }

    // Obtener el último registro de serviciofaena
    this.prdcS.getProdcarOrden().subscribe((lastPrdc: ProdCarnicos) => {
      let lastNumpro = lastPrdc ? lastPrdc.numpro : 0; // Si no hay registros previos, iniciar con 0
      let newNumpro = lastNumpro + 1;

      // Preparar el objeto para ser guardado
      this.prdcI = {
        idprod: 0,
        fechaing: (this.form.controls.fechaing.value).toUpperCase(),
        pesotot: this.total,
        estado: 1,
        clientes: this.clientesI,
        obserpro: (this.form.controls.obserpro.value).toUpperCase(),
        numpro: newNumpro, // Aquí asignas el nuevo valor calculado
      };

      // Guardar el producto cárnico
      this.prdcS.saveProdCarnicos(this.prdcI).subscribe(resp => {
        // Obtener nuevamente el último registro después de guardar
        this.prdcS.getProdcarOrden().subscribe(resp => {
          this.compraLast = resp;
          this.idcomaux = this.compraLast.idprod;

          // Guardar los detalles del producto cárnico
          for (let i = 0; i < this.apiDetprdctemp.length; i++) {
            this.apiDetprodc[i] = this.apiDetprdctemp[i];
            this.apiDetprodc[i].idprod = this.idcomaux;
            this.prdcS.saveDetprodcar(this.apiDetprodc[i]).subscribe(resp => {
              // Detalles guardados
            });
          }

          // Cancelar y actualizar la lista
          this.cancelar();
          this.detalleProdcarnicos.listarProdc();
        });
      }, error => {
        console.log("Error while saving data in the DB");

        // Manejo de filtros en caso de error
        this.formFiltro.controls.filtro.setValue('');
        this.formFiltro.controls.estadosPrdc.setValue('-1');
        this.detalleProdcarnicos.onChangeFiltroNombre('', -1);
      });

      // Mensaje de éxito
      this._success.next(`Los Datos se GUARDARON Satisfactoriamente..!`);  // Para el mensaje
    });  // Cierre del primer subscribe
  }  // Cierre de la función onSubmit


  pesoing: number = 0;
  pesotot: number = 0;

  calcularTotalSubdet() {
    this.pesotot = this.pesoing;
    for (const det of this.apidetprodc) {
      this.pesotot += det.pesoing;
    }
    console.log('pesotot:', this.pesotot);
  }

/*
  // Manejar cambio en Servicio Faena
  onServicioFaenaChange(event: Event): void {
    const selectedServiceId = (event.target as HTMLSelectElement).value;

    // Filtrar los detalles de servicio faena según el id del servicio faena seleccionado
    if (selectedServiceId) {
      this.filteredDetserviciofaena = this.apiDetserviciofaena.filter(dserfa => dserfa.idserfae == selectedServiceId);
    } else {
      this.filteredDetserviciofaena = []; // Resetea si no se selecciona nada
    }
  }
*/

onServicioFaenaChange(event: Event): void {
  const selectedServiceId = (event.target as HTMLSelectElement).value;

  // Filtrar los detalles de servicio faena según el id del servicio faena seleccionado y estado = 1
  if (selectedServiceId) {
    this.filteredDetserviciofaena = this.apiDetserviciofaena.filter(
      dserfa => dserfa.idserfae == selectedServiceId && dserfa.estado == 1
    );
  } else {
    this.filteredDetserviciofaena = []; // Resetea si no se selecciona nada
  }
}

  onDetalleServicioFaenaChange(event: Event): void {
    const selectedDetalleId = (event.target as HTMLSelectElement).value;

    if (selectedDetalleId) {
      // Buscar el detalle en la lista
      const selectedDetalle = this.filteredDetserviciofaena.find(dserfa => dserfa.iddetser == selectedDetalleId);

      // Verificar si se encontró un detalle válido
      if (selectedDetalle && selectedDetalle.animales) {
        const tipoAnimal = selectedDetalle.animales.tipoanimal;
        this.selectedTipoAnimalId = tipoAnimal ? tipoAnimal.idtip : null;

        if (this.selectedTipoAnimalId) {
          this.formdet.controls.tipoanimal.setValue(this.selectedTipoAnimalId);
          this.filterProductosCarnicosByTipoAnimal();
          this.filterCamarasByTipoAnimal();
        }
      } else {
        console.log('No se encontró un detalle válido para el id:', selectedDetalleId);
      }
    }
  }

  // Filtrar los tipos de productos cárnicos por el tipo de animal seleccionado
  filterProductosCarnicosByTipoAnimal(): void {
    if (this.selectedTipoAnimalId) {
      this.filteredTipoprodcarnico = this.apiTipoprodcarnico.filter(
        prod => prod.tipoanimal && prod.tipoanimal.idtip === this.selectedTipoAnimalId
      );
    } else {
      this.filteredTipoprodcarnico = [];
    }
  }

  // Filtrar las cámaras de frío por el tipo de animal seleccionado
  filterCamarasByTipoAnimal(): void {
    if (this.selectedTipoAnimalId) {
      this.filteredCamara = this.apiCamara.filter(
        camara => camara.tipoanimal && camara.tipoanimal.idtip === this.selectedTipoAnimalId
      );
    } else {
      this.filteredCamara = [];
    }
  }

  llamaModaldet(modal) {
    this.submitted = false;
    this.formdet.reset([{ pesoing: '', serviciofaena: '', detserviciofaena: '', tipoanimal: '', tipoprodcarnico: '', camara: '' }]);
    this.prdcS.getDetprodcarLista().subscribe(respo => {
      this.apiDetprodc = respo;
    });
    this.calcularTotalSubdet();
    this.modalReference2 = this.modalService.open(modal, { size: 'lg', centered: true });
  }

  onDetcompras() {
    this.actualizarlistatemp();
    this.submitted = true;
    if (this.formdet.invalid) {
      return;
    }

    // Actualizar el total
    this.total += this.formdet.controls.pesoing.value;

    // Asignar valores seleccionados
    for (let i = 0; i < this.apiServiciofaena.length; i++) {
      if (this.formdet.controls.serviciofaena.value == this.apiServiciofaena[i].idserfae) {
        this.serviciofaenaI = this.apiServiciofaena[i];
      }
    }

    // Filtrar el detalle de servicio de faena
    for (let i = 0; i < this.apiDetserviciofaena.length; i++) {
      if (this.formdet.controls.detserviciofaena.value == this.apiDetserviciofaena[i].iddetser) {
        this.detserviciofaenaI = this.apiDetserviciofaena[i];
      }
    }

    for (let i = 0; i < this.apiTipoanimal.length; i++) {
      if (this.formdet.controls.tipoanimal.value == this.apiTipoanimal[i].idtip) {
        this.tipoanimalI = this.apiTipoanimal[i];
      }
    }

    // Esta parte se mantiene como está
    for (let i = 0; i < this.apiTipoprodcarnico.length; i++) {
      if (this.formdet.controls.tipoprodcarnico.value == this.apiTipoprodcarnico[i].idtipro) {
        this.tipoprodcarnicoI = this.apiTipoprodcarnico[i];
      }
    }

    for (let i = 0; i < this.apiCamara.length; i++) {
      if (this.formdet.controls.camara.value == this.apiCamara[i].idcamfri) {
        this.camaraI = this.apiCamara[i];

        // Verificar la capacidad antes de actualizar
        const nuevoCanting = this.camaraI.canting + this.formdet.controls.pesoing.value;

        // Validar capacidad
        if (nuevoCanting > this.camaraI.capcam) {
          console.log('Capacidad excedida. No se puede guardar el producto en esta cámara.');
          return; // Salir si no hay capacidad
        } else if (nuevoCanting === this.camaraI.capcam) {
          // Cambiar estado a 0 si la cámara está llena
          this.camaraI.estado = 0;
          console.log('Cámara llena. Estado actualizado a 0 (no disponible)');
        }

        // Actualizar la cantidad ingresada
        this.camaraI.canting = nuevoCanting;
        this.camaraI.saldo = this.camaraI.capcam - this.camaraI.canting;

        // Llamar al método para actualizar la cámara
        this.camS.updateCamara(this.camaraI.idcamfri, this.camaraI).subscribe(res => {
          console.log('Cámara actualizada correctamente', res);
        }, error => {
          console.log('Error al actualizar la cámara', error);
        });
      }
    }

    // Crear el objeto de detalle del producto cárnico
    this.detprodcI = {
      idtemprodc: 0,
      pesoing: this.formdet.controls.pesoing.value,
      idprod: 0,
      serviciofaena: this.serviciofaenaI,
      detserviciofaena: this.detserviciofaenaI,
      tipoanimal: this.tipoanimalI,
      tipoprodcarnico: this.tipoprodcarnicoI,
      camara: this.camaraI,
    };

    // Guardar detalle temporal del producto cárnico
    this.prdcS.saveDetprodcartemp(this.detprodcI).subscribe(respo => {
      // Actualizar lista temporal
      this.prdcS.getDetprodcarListatemp().subscribe(respo => {
        this.apiDetprdctemp = respo;
      });

      this.modalReference2.close();
    }, error => {
      console.log('Error al guardar en la base de datos');
    });
  }

  // Método para actualizar la lista temporal
  actualizarlistatemp() {
    this.prdcS.getDetprodcarListatemp().subscribe(respo => {
      this.apiDetprdctemp = respo;
    });
  }

  eliminardet(idtemprodc: number, pesoing: number, camaraId: number) {
    this.prdcS.eliminarDetprodcartemp(idtemprodc).subscribe(
      () => {
        console.log('Detalle de compra eliminado con éxito');
        console.log('Peso eliminado:', pesoing);

        // Actualizar el total
        this.total = this.total - pesoing;

        // Actualizar lista temporal después de eliminar
        this.actualizarlistatemp();

        // Actualizar lista principal después de eliminar
        this.prdcS.getDetprodcarLista().subscribe(respo => {
          this.apiDetprodc = respo;
        });

        // Recalcular el total después de la eliminación
        this.calcularTotalSubdet();

        // Obtener la cámara correspondiente
        this.camS.getCamara(camaraId).subscribe(camara => {
          console.log('Peso antes de eliminar en la cámara:', camara.canting);

          // Verificar que pesoing no sea negativo o inválido
          if (pesoing > 0 && camara.canting >= pesoing) {
            // Restar el peso eliminado de la cantidad en la cámara
            camara.canting -= pesoing;

            // Actualizar el saldo de la cámara
            camara.saldo = camara.capcam - camara.canting;

            // Si la cámara estaba llena (estado 0) y se libera espacio, cambia el estado a disponible (1)
            if (camara.canting < camara.capcam && camara.estado === 0) {
              camara.estado = 1;
              console.log('Cámara liberada. Estado actualizado a 1 (disponible)');
            }

            console.log('Peso después de eliminar en la cámara:', camara.canting);
            console.log('Nuevo saldo en la cámara:', camara.saldo);

            // Llamar al servicio para actualizar la cámara
            this.camS.updateCamara(camara.idcamfri, camara).subscribe(res => {
              console.log('Cámara actualizada correctamente después de la eliminación', res);
            }, error => {
              console.log('Error al actualizar la cámara después de la eliminación', error);
            });
          } else {
            console.log('Error: el peso a eliminar es mayor que el peso en la cámara o inválido.');
          }
        });
      },
      (error) => {
        console.error('Error al eliminar el detalle de compra', error);
      }
    );
  }
}
