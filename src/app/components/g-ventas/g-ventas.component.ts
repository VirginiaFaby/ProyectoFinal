import { Component, OnInit, ViewChild } from '@angular/core';
import { DetventasComponent } from './detventas/detventas.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { VentasService } from 'src/app/service/ventas.service';
import { Clientes } from 'src/app/model/clientes.model';
import { Animales } from 'src/app/model/animales.model';
import { Detventastemp, Ventas } from 'src/app/model/ventas.model';
import { ClientesService } from 'src/app/service/clientes.service';
import { AnimalesService } from 'src/app/service/animales.service';
import { Subject } from 'rxjs';
import { Compras, Detcompras, Detcomtemp } from 'src/app/model/compras.model';
import { ComprasService } from 'src/app/service/compras.service';
import { Usuarios } from 'src/app/model/usuarios.model';
import { Personas } from 'src/app/model/personas.model';
import { ServiciofaenaService } from 'src/app/service/serviciofaena.service';


@Component({
  selector: 'app-g-ventas',
  templateUrl: './g-ventas.component.html',
  styleUrls: ['./g-ventas.component.css']
})
export class GVentasComponent implements OnInit {

  @ViewChild(DetventasComponent) detalleVentas: DetventasComponent


  form: FormGroup;
  formdet: FormGroup;
  formFiltro: FormGroup;
  submitted = false
  total = 0;
  totcan = 0;

  //ventas
  personaLogueada: Personas | null = null; // Cambia el tipo a 'number'

  venI: Ventas;
  detvenI: Detventastemp;
  apiVentas: any;
  apiDetventas: any;
  apiDetventemp: any;
  apidetventas: any[] = [];

  //clientes
  clientesI: Clientes;
  apiClientes: any;

  //Animales 
  animalesI: Animales;
  apiAnimales: any;

  apiAnimalesaux: any[] = [];

  //compras 
  comI: Compras;
  apiCompras: any;
  detcomI: Detcompras;
  apiDetcompras: any;
  apidetcompras: Detcompras[] = []; // Inicializa con tus datos

  filteredDetcompras: any[] = [];


  animalCtrl = new FormControl('');
  mostrarListaAnimales = false;
  interactuandoConListaAnimales = false;
  filteredAnimales: Animales[] = [];
  animalSeleccionado: Animales | null = null;

  animalesFiltrados: Animales[] = [];

  clienteCtrl = new FormControl(); // Control reactivo para búsqueda de clientes
  filteredClientes: any[] = []; // Lista de clientes filtrados
  mostrarLista = false; // Controla si mostrar la lista de sugerencias
  clienteSeleccionado: any; // Cliente seleccionado
  interactuandoConLista = false;


  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage: string;
  modalReference: NgbModalRef;
  modalReference2: NgbModalRef;


  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private venS: VentasService,
    private cliS: ClientesService,
    private aniS: AnimalesService,
    private comS: ComprasService,
    private serfaS: ServiciofaenaService,
  ) {

    const usuarioData = localStorage.getItem('currentUser');
    console.log('Contenido de localStorage:', usuarioData);

    if (usuarioData) {
      this.personaLogueada = JSON.parse(usuarioData) as Personas; // Almacena el objeto completo de Personas
      console.log("Usuario logueado:", this.personaLogueada.idper); // Ahora tienes acceso a todas las propiedades de Personas
    } else {
      console.error("Persona no encontrada en localStorage");
    }


    this.cliS.getClientesLista().subscribe(respon => {
      this.apiClientes = respon;
    });
    this.aniS.getAnimalesLista().subscribe(respo => {
      this.apiAnimales = respo;
    });
    this.comS.getComprasLista().subscribe(response => {
      this.apiCompras = response;
    });
    this.comS.getDetcomprasLista().subscribe(respo => {
      this.apiDetcompras = respo;
      //console.log(this.apiDetcompras);
      this.filterDetcompras(); // Llamar al filtro después de cargar los datos
    });
    this.venS.eliminarDetventemptodo(1).subscribe(respon => { });
    this.actualizarlistatemp();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      fecven: ['', [Validators.required, this.todayValidator()]],
      impven: [''],
      clientes: ['', [Validators.required]],

    });
    this.formFiltro = this.formBuilder.group({
      idcli: [null],
      estadoVen: ['-1', [Validators.required]],
    });

    this.formdet = this.formBuilder.group({
      preven: ['', [Validators.required]],
      detcompras: ['', [Validators.required]],

    });
    this.venS.getDetventasLista().subscribe((data: any[]) => {
      this.apiDetventas = data;
      //console.log(this.apiDetventas);
    });

    this.venS.getDetventasListatemp().subscribe(respo => {
      this.apiDetventemp = respo;
    });

  }

  get f() { return this.form.controls; }
  get f2() { return this.formFiltro.controls; }
  get f3() { return this.formdet.controls; }


  filtrarNombre(): void {
    const idcli = this.formFiltro.value.idcli;
    const estadoVen = this.formFiltro.value.estadoVen;
    console.log("filtrar..", idcli, estadoVen);
    this.detalleVentas.onChangeFiltroNombre(idcli, estadoVen);
    this.venS.buscarVentas(idcli, estadoVen).subscribe(respon => {
      this.apiVentas = respon;
    })
  }

  todayValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const today = new Date().toISOString().split('T')[0];
      return control.value === today ? null : { dateNotToday: true };
    };
  }

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

  filtrarAnimales(filtro: string): void {
    if (!filtro || filtro.trim() === '') {
      this.filteredDetcompras = []; // Limpia la lista si el filtro está vacío
      return;
    }
  
    this.comS.buscarAnimalesPorFiltro(filtro).subscribe(
      (data) => {
        this.filteredDetcompras = data; // Asignar el resultado correctamente
        if (!data.length) {
          console.warn('No se encontraron animales para el filtro:', filtro);
        }
      },
      (error) => console.error('Error al filtrar animales:', error)
    );
  }

  seleccionarAnimal(dcom: any): void {
    // Obtén el nombre de la raza y el peso, o usa valores por defecto si son undefined
    const raza = dcom.animales?.razas?.nomraz || 'Sin raza';
    const peso = dcom.animales?.pesani ? `${dcom.animales.pesani} kg` : 'Peso desconocido';
  
    // Establece el valor en el control de entrada
    this.animalCtrl.setValue(`${raza} - ${peso}`);
  
    // Actualiza el formulario con los datos seleccionados
    this.formdet.patchValue({
      detcompras: dcom.iddetcom, // Identificador del animal
      preven: dcom.preven        // Precio del animal
    });
  
    // Oculta la lista
    this.mostrarListaAnimales = false;
  }
  
  
  ocultarListaAnimales(): void {
    setTimeout(() => {
      if (!this.interactuandoConListaAnimales) {
        this.mostrarListaAnimales = false;
      }
    }, 300); // Un pequeño retraso para evitar que la lista desaparezca abruptamente
  }
  

  llamaModalAdd(modal) {
    this.submitted = false;
    const today = new Date();
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];
    this.form.patchValue({
      fecven: localDate, impven: '', numven: '', canani: '', clientes: ''
    });

    // Limpiar datos temporales antes de abrir el modal
    this.venS.eliminarDetventemptodo(1).subscribe(() => {
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
    this.venS.eliminarDetventemptodo(1).subscribe(resp => {
      //this.actualizarlistatemp();  // Actualiza la lista temporal después de cerrar
      this.total = 0;
      this.totcan = 0;
    });
    // Limpia el buscador de clientes después de guardar
    this.form.controls['clientes'].setValue(''); // Limpia el campo del formulario
    this.clienteCtrl.setValue(''); // Limpia el input del buscador
    this.filteredClientes = []; // Limpia la lista filtrada
    this.clienteSeleccionado = null;
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
    // Validar si un cliente ha sido seleccionado
    if (!this.form.controls.clientes.value) {
      console.error("Debe seleccionar un cliente.");
      return;
    }
    // Encontrar el cliente seleccionado en la lista
    for (let i = 0; i < this.apiClientes.length; i++) {
      if (this.form.controls.clientes.value == this.apiClientes[i].idcli) {
        this.clientesI = this.apiClientes[i];
      }
    }
    // Validar si un cliente fue encontrado
    if (!this.clientesI) {
      console.error("El cliente seleccionado no es válido.");
      return;
    }


    this.venS.getVentasOrden().subscribe((lastVen: Ventas) => {
      let lastNumven = lastVen ? lastVen.numven : 0; // Si no hay registros previos, iniciar con 0
      let newNumven = lastNumven + 1;

      // Verifica si el usuario logueado es válido
      if (!this.personaLogueada) {
        console.error("Usuario no encontrado en localStorage");
        return;
      }



      // Preparar el objeto para ser guardado
      this.venI = {
        idven: 0,
        fecven: (this.form.controls.fecven.value).toUpperCase(),
        impven: this.total,
        canani: this.totcan,
        estado: 1,
        clientes: this.clientesI,
        numven: newNumven, // Aquí asignas el nuevo valor calculado
        personas: this.personaLogueada,
      };

      // Validar si `total` tiene un valor válido
      if (!this.total || this.total <= 0) {
        console.error("El total del servicio no puede ser cero o negativo.");
        return;
      }

      // Guardar el producto cárnico
      this.venS.saveVentas(this.venI).subscribe(resp => {
        // Obtener nuevamente el último registro después de guardar
        this.venS.getVentasOrden().subscribe(resp => {
          this.compraLast = resp;
          this.idcomaux = this.compraLast.idven;

          // Guardar los detalles del producto cárnico
          for (let i = 0; i < this.apiDetventemp.length; i++) {
            this.apiDetventas[i] = this.apiDetventemp[i];
            this.apiDetventas[i].idven = this.idcomaux;
            this.venS.saveDetventas(this.apiDetventas[i]).subscribe(resp => {
              // Detalles guardados
            });
          }

          // Cancelar y actualizar la lista
          this.cancelar();
          this.detalleVentas.listarVentas();

          // Limpia el buscador de clientes después de guardar
          this.form.controls['clientes'].setValue(''); // Limpia el campo del formulario
          this.clienteCtrl.setValue(''); // Limpia el input del buscador
          this.filteredClientes = []; // Limpia la lista filtrada
          this.clienteSeleccionado = null;



        });
      }, error => {
        console.log("Error while saving data in the DB");

        // Manejo de filtros en caso de error
        this.formFiltro.controls.idcli.setValue(null);
        this.formFiltro.controls.estadoVen.setValue('-1');
        this.detalleVentas.onChangeFiltroNombre(null, -1);
      });

      // Mensaje de éxito
      this._success.next(`Los Datos se GUARDARON Satisfactoriamente..!`);  // Para el mensaje
    });  // Cierre del primer subscribe
  }  // Cierre de la función onSubmit


  preven: number = 0;
  impven: number = 0;

  calcularTotalSubdet() {
    this.impven = this.preven;
    for (const det of this.apidetventas) {
      this.impven += det.subven;
    }
    console.log('impven:', this.impven);
  }

  canven: number = 1;
  canani: number = 0;

  calcularTotcanSubdet() {
    this.canani = this.canven;
    for (const det of this.apidetventas) {
      this.canani += det.canven;
    }
    console.log('canani:', this.canani);
  }

  filterDetcompras(): void {
    this.filteredDetcompras = this.apiDetcompras.filter(dcom => {

      return (
        dcom.animales && // Asegúrate de que 'animales' no sea null o undefined
        dcom.animales.estado === 0 && // Verificar que el estado del animal sea 0
        dcom.animales.tipocs === 'compra' // Verificar que tipocs sea "compra"
      );
    });

    //console.log('Resultados filtrados:', this.filteredDetcompras); // Imprime los resultados esperados
  }

  onDetcomprasChange(event: Event): void {
    const selectedDetcomId = Number((event.target as HTMLSelectElement).value);
    const selectedDetcompras = this.filteredDetcompras.find(dcom => dcom.iddetcom === selectedDetcomId);

    if (selectedDetcompras) {
      this.formdet.get('preven')?.setValue(selectedDetcompras.preven); // Cambia `this.form` a `this.formdet`
    } else {
      this.formdet.get('preven')?.setValue(null);
    }
  }

  llamaModaldet(modal) {
    this.submitted = false;
    this.formdet.reset([{ canven: '', preven: '', subven: '' }]);
    this.venS.getDetventasListatemp().subscribe(respo => {
      this.apiDetventemp = respo;
    });
    this.calcularTotalSubdet();
    this.calcularTotcanSubdet();
    this.modalReference2 = this.modalService.open(modal, { size: 'lg', centered: true });
  }

  onDetcompras() {
    this.actualizarlistatemp();
    this.submitted = true;
    if (this.formdet.invalid) {
      return;
    }
    // Establece `cancom` a 1 antes de las operaciones
    this.canven = 1;
    this.totcan += this.canven;

    this.total += this.formdet.controls.preven.value;

    // Asignar valores seleccionados
    for (let i = 0; i < this.apiDetcompras.length; i++) {
      if (this.formdet.controls.detcompras.value == this.apiDetcompras[i].iddetcom) {
        this.detcomI = this.apiDetcompras[i];
      }
    }
    this.detvenI = {
      idtempven: 0,
      canven: this.canven,
      preven: this.formdet.controls.preven.value,
      idven: 0,
      detcompras: this.detcomI,
    }

    // Guardar detalle temporal del producto cárnico
    this.venS.saveDetventastemp(this.detvenI).subscribe(respo => {
      // Actualizar lista temporal
      this.actualizarlistatemp();

      // Después de actualizar, recargar `apiDetcompras` y aplicar el filtro
      this.comS.getDetcomprasLista().subscribe(respo => {
        this.apiDetcompras = respo;
        this.filterDetcompras(); // Aplicar filtro con los datos más recientes
      });

      // Cerrar el modal si todo es exitoso
      this.modalReference2.close();
      this.animalCtrl.reset();  // Limpiar el campo de búsqueda
    }, error => {
      console.log('Error al guardar en la base de datos');
    });
  }

  // Método para actualizar la lista temporal
  actualizarlistatemp() {
    this.venS.getDetventasListatemp().subscribe(respo => {
      this.apiDetventemp = respo;
    });
  }

  eliminardet(idtempven: number, canven: number, preven: number) {
    this.venS.eliminarDetventemp(idtempven).subscribe(
      () => {
        //  console.log('Detalle de venta eliminado con éxito');

        // Restar antes de actualizar la lista y los totales
        this.totcan -= canven;
        this.total -= preven;

        // Actualizar la lista temporal y `apiDetcompras`
        this.actualizarlistatemp(); // Método para actualizar `apiDetventemp`

        // Después de actualizar, recargar `apiDetcompras` y aplicar el filtro
        this.comS.getDetcomprasLista().subscribe(respo => {
          this.apiDetcompras = respo;
          this.filterDetcompras(); // Aplicar filtro con los datos más recientes
        });

        this.calcularTotalSubdet();
        this.calcularTotcanSubdet();
      },
      (error) => {
        console.error('Error al eliminar el detalle de venta', error);
      }
    );
  }




}
