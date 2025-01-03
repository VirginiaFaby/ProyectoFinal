import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { Compras, Detcompras } from 'src/app/model/compras.model';
import { ComprasService } from 'src/app/service/compras.service';
import { DetcomprasComponent } from './detcompras/detcompras.component';
import { GuiasenasagService } from 'src/app/service/guiasenasag.service';
import { Animales } from 'src/app/model/animales.model';
import { AnimalesService } from 'src/app/service/animales.service';
import { Detcomtemp } from '../../model/compras.model';
import { Granjas } from 'src/app/model/granjas.model';
import { GranjasService } from 'src/app/service/granjas.service';
import { Guiasenasag } from 'src/app/model/guiasenasag.model';
import { ServiciofaenaService } from 'src/app/service/serviciofaena.service';


@Component({
  selector: 'app-g-compras',
  templateUrl: './g-compras.component.html',
  styleUrls: ['./g-compras.component.css']
})
export class GComprasComponent implements OnInit {

  @ViewChild(DetcomprasComponent) detalleCompras: DetcomprasComponent;


  form: FormGroup;
  formFiltro: FormGroup;
  formdet: FormGroup;
  submitted = false;
  total = 0;
  totcan = 0;

  //Compras 
  comI: Compras;
  detcomI: Detcomtemp
  apiCompras: any;
  apiDetcompras: any;
  apiDetcomtemp: any;
  apidetcompras: any[] = [];

  //Granjas
  granjasI: Granjas;
  apiGranjas: any;

  //Animales 
  animalesI: Animales;
  apiAnimales: any;

  apiAnimalesaux: any[] = [];

  //Guiasenasag
  guiasenasagI: Guiasenasag;
  apiGuiasenasag: any;
  filteredGuiasenasag: Guiasenasag[] = [];
  apiguiasenasag: any[];

  apiTipoanimal: any;

  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage: string;
  modalReference: NgbModalRef;
  modalReference2: NgbModalRef;

  animalesFiltrados = []; // Lista filtrada de animales
  animalSeleccionado = null;


  granjaCtrl = new FormControl();
  filteredGranjas: any[] = []; // Lista de granjas filtradas
  mostrarListaGranjas = false; // Controla si mostrar la lista de sugerencias
  granjaSeleccionada: any; // Granja seleccionada
  interactuandoConListaGranjas = false; // Indica si el usuario está interactuando con la lista



  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private comS: ComprasService,
    private aniS: AnimalesService,
    private granS: GranjasService,
    private guiS: GuiasenasagService,
    private serfaS: ServiciofaenaService,

  ) {
    this.granS.getGranjasLista().subscribe(respo => {
      this.apiGranjas = respo;
    });
    this.aniS.getAnimalesLista().subscribe(respo => {
      this.apiAnimales = respo;
    });
    this.guiS.getGuiasenasagLista().subscribe(respo => {
      this.apiGuiasenasag = respo;
    });
    this.comS.eliminarDetcompratemptodo(1).subscribe(resp => { })
    this.actualizarlistatemp();

    this.aniS.getTipoAnimalesLista().subscribe(respo => {
      this.apiTipoanimal = respo;
    });

  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      feccom: ['', [Validators.required, this.todayValidator()]],
      impcom: [''],
      granjas: ['', [Validators.required]],

    });
    this.formFiltro = this.formBuilder.group({
      idgranja: [null],
      estadoCom: ['-1', [Validators.required]],
    });
    this.formdet = this.formBuilder.group({

      precom: ['', [Validators.required]],
      preven: ['', [Validators.required]],
      prekil: ['', [Validators.required]],
      animales: ['', [Validators.required]],
      //para seleccionar por guia el animal 
      guiasenasag: [''],

      pesani: [{ value: '', disabled: true }],
      origenani: [{ value: '', disabled: true }],
      tipoanimal: [{ value: '', disabled: true }],

    });

    this.comS.getDetcomprasLista().subscribe((data: any[]) => {
      this.apiDetcompras = data;
      console.log(this.apiDetcompras);
    });
    this.comS.getdetcomprasListatemp().subscribe(respo => {
      this.apiDetcomtemp = respo;
    });
    this.serfaS.getGuiasenasaglistas().subscribe((data: Guiasenasag[]) => {
      this.apiguiasenasag = data;
    });
    // Suscribirse al cambio de valor de guiasenasag para habilitar/deshabilitar el campo de animales
    this.formdet.get('guiasenasag').valueChanges.subscribe(value => {
      this.filteredGuiasenasag = this._filterGuiasenasag(value);
      if (value) {
        this.formdet.get('animales').enable(); // Habilitar campo de animales si hay un valor en guiasenasag
      } else {
        this.formdet.get('animales').disable(); // Deshabilitar campo de animales si no hay un valor en guiasenasag
      }
    });
    this.comS.getComprasLista().subscribe(response => {
      this.apiCompras = response;
    });



    /// datos automaticos en animales 

    this.aniS.getAnimalesLista().subscribe((respo) => {
      this.apiAnimales = respo;
      //console.log("Contenido de apiAnimales:", this.apiAnimales);

      // Suscribirse a valueChanges para el control 'animales'
      this.formdet.get('animales')?.valueChanges.subscribe((idani) => {
        //console.log("ID de animal seleccionado:", idani);
        const idAnimalNum = +idani; // Convierte a número si es necesario
        const animalSeleccionado = this.apiAnimales.find(ani => ani.idani === idAnimalNum);
        // console.log("Animal seleccionado:", animalSeleccionado);

        if (animalSeleccionado) {
          this.formdet.patchValue({
            pesani: animalSeleccionado.pesani,
            origenani: animalSeleccionado.origenani,
            tipoanimal: animalSeleccionado.tipoanimal.nomtip
          });
        } else {
          this.formdet.patchValue({
            pesani: '',
            origenani: '',
            tipoanimal: ''
          });
        }
      });
    });

    // Suscribirse a los cambios de `animales`
    this.formdet.get('animales').valueChanges.subscribe(idAnimal => {
      console.log("ID de animal recibido:", idAnimal); // Verificar el ID recibido
      this.asignarAnimal(idAnimal); // Asignar el animal seleccionado a `animalesI`
    });

    // Suscribirse a los cambios de `precom`
    this.formdet.get('precom').valueChanges.subscribe(precomValue => {
      console.log("Valor de precom:", precomValue); // Verificar el valor de precom
      if (this.animalesI) {
        this.calcularPrecioVenta(precomValue); // Llama a la función para calcular el precio de venta
      } else {
        console.log("animalesI no está definido al calcular el precio de venta.");
      }
    });

  }



  asignarAnimal(idAnimal: number) {
    console.log("ID de animal recibido:", idAnimal);
    console.log("Animales disponibles:", this.apiAnimales); // Mostrar los animales disponibles para depuración

    // Asegúrate de que ambos ID sean del mismo tipo
    this.animalesI = this.apiAnimales.find(animal => animal.idani === Number(idAnimal));

    if (this.animalesI) {
      console.log("Animal asignado correctamente:", this.animalesI);
    } else {
      console.log("No se encontró un animal con el ID:", idAnimal);
    }
  }


  get f() { return this.form.controls; }
  get f2() { return this.formFiltro.controls; }
  get f3() { return this.formdet.controls; }

  filtrarNombre(): void {
    const idgranja = this.formFiltro.value.idgranja;
    const estadoCom = this.formFiltro.value.estadoCom;
    console.log("filtrar..", idgranja, estadoCom);
    this.detalleCompras.onChangeFiltroNombre(idgranja, estadoCom);
    this.comS.buscarCompras(idgranja, estadoCom).subscribe(respon => {
      this.apiCompras = respon;
    })
  }

  filtrarGranjas(filtro: string): void {
    this.guiS.buscarGranjas(filtro).subscribe(granjas => {
      this.filteredGranjas = granjas; // Actualiza la lista de granjas filtradas
      this.mostrarListaGranjas = true; // Asegura que la lista se muestre después de filtrar
    });
  }

  seleccionarGranja(granja: any): void {
    this.granjaSeleccionada = granja; // Guarda la granja seleccionada
    this.form.controls['granjas'].setValue(granja.idgranja); // Asigna el ID al formulario
    this.granjaCtrl.setValue(`${granja.nomgra} - ${granja.codigo}`); // Muestra la granja seleccionada en el input
    this.mostrarListaGranjas = false; // Oculta la lista después de seleccionar una granja
  }

  ocultarListaGranjas(): void {
    if (!this.interactuandoConListaGranjas) {
      // Solo oculta la lista si no se está interactuando con ella
      this.mostrarListaGranjas = false;
    }
  }

  todayValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const today = new Date().toISOString().split('T')[0];
      return control.value === today ? null : { dateNotToday: true };
    };
  }

  llamaModalAdd(modal) {
    this.submitted = false;
    const today = new Date();
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];
    this.form.patchValue({
      feccom: localDate, impcom: '', numcom: '', cancani: '', granjas: ''
    });

    // Limpiar datos temporales antes de abrir el modal
    this.comS.eliminarDetcompratemptodo(1).subscribe(() => {
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
    this.comS.eliminarDetcompratemptodo(1).subscribe(resp => {
      //this.actualizarlistatemp();  // Actualiza la lista temporal después de cerrar
      this.total = 0;
      this.totcan = 0;
    });
    this.form.controls['granjas'].setValue('');
    this.granjaCtrl.setValue('');
    this.filteredGranjas = [];
    this.granjaSeleccionada = null;

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
    if (!this.form.controls.granjas.value) {
      console.error("Debe seleccionar un GRANJA.");
      return;
    }

    // Encontrar el cliente seleccionado en la lista
    for (let i = 0; i < this.apiGranjas.length; i++) {
      if (this.form.controls.granjas.value == this.apiGranjas[i].idgranja) {
        this.granjasI = this.apiGranjas[i];
      }
    }

    // Validar si un cliente fue encontrado
    if (!this.granjasI) {
      console.error("El granja seleccionado no es válido.");
      return;
    }

    // Obtener el último registro de serviciofaena
    this.comS.getComprasOrden().subscribe((lastCom: Compras) => {
      let lastNumcom = lastCom ? lastCom.numcom : 0; // Si no hay registros previos, iniciar con 0
      let newNumcom = lastNumcom + 1;

      // Preparar el objeto para ser guardado
      this.comI = {
        idcom: 0,
        feccom: (this.form.controls.feccom.value).toUpperCase(),
        impcom: this.total,
        numcom: newNumcom, // Aquí asignas el nuevo valor calculado
        cancani: this.totcan,
        comven: 0,
        parven: this.totcan,
        estado: 1,
        granjas: this.granjasI,

      };

      // Validar si `total` tiene un valor válido
      if (!this.total || this.total <= 0) {
        console.error("El total compra no puede ser cero o negativo.");
        return;
      }

      // Guardar el producto cárnico
      this.comS.saveCompras(this.comI).subscribe(resp => {
        // Obtener nuevamente el último registro después de guardar
        this.comS.getComprasOrden().subscribe(resp => {
          this.compraLast = resp;
          this.idcomaux = this.compraLast.idcom;

          // Guardar los detalles del producto cárnico
          for (let i = 0; i < this.apiDetcomtemp.length; i++) {
            this.apiDetcompras[i] = this.apiDetcomtemp[i];
            this.apiDetcompras[i].idcom = this.idcomaux;
            this.comS.saveDetcompras(this.apiDetcompras[i]).subscribe(resp => {
            });
          }

          // Cancelar y actualizar la lista
          this.cancelar();
          this.detalleCompras.listarCompras();

          this.form.controls['granjas'].setValue('');
          this.granjaCtrl.setValue('');
          this.filteredGranjas = [];
          this.granjaSeleccionada = null;
        });
      }, error => {
        console.log("Error while saving data in the DB");

        // Manejo de filtros en caso de error
        this.formFiltro.controls.idgranja.setValue(null);
        this.formFiltro.controls.estadoCom.setValue('-1');
        this.detalleCompras.onChangeFiltroNombre(null, -1);
      });
      this._success.next(`Los Datos se GUARDARON Satisfactoriamente..!`);  // Para el mensaje
    });
  }
  
  //Detalle de compras 
  private _filterGuiasenasag(value: string | number): Guiasenasag[] {
    if (!value) {
      return this.apiGuiasenasag;
    }
    const filterValue = value.toString().toLowerCase(); // Convertir a cadena y luego a minúsculas
    return this.apiGuiasenasag.filter(gui => {
      const nroguia = gui.nroguia ? gui.nroguia.toString().toLowerCase() : '';
      return nroguia.includes(filterValue);
    });
  }

  cargarGuiasenasag() {
    console.log('La función cargarGuiasenasag se ha llamado.');
    const controlGuiasenasag = this.formdet.get('guiasenasag');
    if (controlGuiasenasag !== null) {
      const guiasenasagId = controlGuiasenasag.value;
      this.serfaS.obtenerAnimalesPorNroguia(guiasenasagId).subscribe(respo => {
        this.apiAnimales = respo;
      });
    } else {
    }
  }
  precom: number = 0;
  impcom: number = 0;


  filtrarAnimales(busqueda: string): void {
    const busquedaLower = busqueda.toLowerCase();

    this.serfaS.buscarAniCom(busqueda).subscribe((animales) => {
      this.animalesFiltrados = animales.filter(animal =>
        animal.razas.nomraz.toLowerCase().includes(busquedaLower) || // Buscar por nombre de raza
        animal.guiasenasag.nroguia.toString().includes(busqueda) || // Buscar por número de guía
        animal.pesani.toString().includes(busqueda) // Buscar por peso
      );
    });
  }

  seleccionarAnimal(animal: Animales): void {
    this.animalSeleccionado = animal;
    // Actualizar los valores del formulario
    this.formdet.patchValue({
      animales: animal.idani,
      pesser: animal.pesani,
      tiposervicios: '',
    });

    // Limpiar la lista de resultados
    this.animalesFiltrados = [];

    // Limpiar el valor del input manualmente
    const buscarAnimalInput = document.getElementById('buscarAnimal') as HTMLInputElement;
    if (buscarAnimalInput) {
      buscarAnimalInput.value = ''; // Limpiar el valor del input
    }
  }
  calcularTotalSubdet() {
    this.impcom = this.precom;
    for (const det of this.apidetcompras) {
      this.impcom += det.subcom;
    }
    console.log('impcom:', this.impcom);
  }

  cancom: number = 1; // `cancom` fijo en 1
  cancani: number = 0;

  calcularTotcanSubdet() {
    this.cancani = this.cancom;
    for (const det of this.apidetcompras) {
      this.cancani += det.canven;
    }
    console.log('cancani:', this.cancani);
  }


  calcularPrecioVenta(precomValue: number) {
    if (!this.animalesI) {
      console.log("animalesI no está definido al calcular el precio de venta.");
      return;
    }

    let porcentaje = 0;
    const origen = this.animalesI.origenani.trim().toUpperCase();

    // Comprobar el origen de los animales
    if (origen === 'CRIOLLA') {
      porcentaje = 0.15;
    } else if (origen === 'GRANJA') {
      porcentaje = 0.20;
    }

    const incremento = precomValue * porcentaje;
    const precioVenta = precomValue + incremento;

    const pesani = this.animalesI.pesani;
    const prekil = pesani > 0 ? precomValue / pesani : 0; // Evitar división por cero

    const precioVentaRedondeado = Math.round(precioVenta * 100) / 100; // Usamos Math.round para redondear a 2 decimales
    const prekilRedondeado = Math.round(prekil * 100) / 100;

    // Agregar console.log para depuración
    console.log("Precio compra:", precomValue);
    console.log("Porcentaje:", porcentaje);
    console.log("Incremento:", incremento);
    console.log("Precio de venta calculado:", precioVentaRedondeado);
    console.log("Precio por kilo (prekilo):", prekilRedondeado);

    // Actualizar valores en el formulario con redondeo aplicado
    this.formdet.patchValue(
      { preven: precioVentaRedondeado, prekil: prekilRedondeado },
      { emitEvent: false }
    );
  }


  llamaModaldet(modal) {
    this.submitted = false;
    this.formdet.reset([{ cancom: '', precom: '', preven: '', subcom: '', animales: '' }]);
    this.comS.getDetcomprasLista().subscribe(respo => {
      this.apiDetcompras = respo;
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
    this.cancom = 1;
    this.totcan += this.cancom;
    // Actualizar el total
    this.total += this.formdet.controls.precom.value;

    // Asignar valores seleccionados
    for (let i = 0; i < this.apiAnimales.length; i++) {
      if (this.formdet.controls.animales.value == this.apiAnimales[i].idani) {
        this.animalesI = this.apiAnimales[i];
      }
    }

    if (!this.animalesI) {
      console.log('No se ha seleccionado ningún animal.');
      return; // Salir si no hay un animal seleccionado
    }

    this.detcomI = {
      idtempcom: 0,
      cancom: this.cancom, // Fijar `cancom` a 1
      precom: this.formdet.controls.precom.value,
      preven: this.formdet.controls.preven.value,
      prekil: this.formdet.controls.prekil.value,
      idcom: 0,
      animales: this.animalesI,
    }
    console.log(this.formdet.valid);
    this.detalleCompras.listarCompras;

    // Guardar detalle temporal del producto cárnico
    this.comS.saveDetcomprastemp(this.detcomI).subscribe(respo => {
      // Actualizar lista temporal
      this.comS.getDetcomprasListatemp().subscribe(respo => {
        this.apiDetcomtemp = respo;
      });

      // Cerrar el modal si todo es exitoso
      this.modalReference2.close();
    }, error => {
      console.log('Error al guardar en la base de datos');
    });
  }

  // Método para actualizar la lista temporal
  actualizarlistatemp() {
    this.comS.getDetcomprasListatemp().subscribe(respo => {
      this.apiDetcomtemp = respo;
    });
  }


  eliminardet(idtempcom: number, cancom: number, precom: number, idani: number) {
    // Eliminar el detalle de compra temporal
    this.comS.eliminarDetcompratemp(idtempcom).subscribe(() => {
      console.log('Detalle de compra eliminado con éxito');

      // Restar antes de actualizar la lista y los totales
      this.totcan -= cancom;
      this.total -= precom;

      // Actualizar la lista temporal
      this.actualizarlistatemp();
      this.calcularTotalSubdet();
      this.calcularTotcanSubdet();

      // Actualizar el estado del animal a 1
      this.comS.actualizarEstadoAnimal(idani, 1).subscribe(() => {
        console.log('Estado del animal actualizado a 1');

        // Actualizar la lista de animales
        this.aniS.getAnimalesLista().subscribe(respo => {
          this.apiAnimales = respo;
          for (let i = 0; i < this.apiAnimalesaux.length; i++) {
            if (this.apiAnimalesaux[i].idani === idani) {
              this.apiAnimales.push(this.apiAnimalesaux[i]);
            }
          }
        });
      },
        (error) => {
          console.error('Error al actualizar el estado del animal', error);
        });
    },
      (error) => {
        console.error('Error al eliminar el detalle de compra', error);
      });
  }


}

