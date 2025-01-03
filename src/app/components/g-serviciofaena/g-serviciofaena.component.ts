import { Component, OnInit, ViewChild } from '@angular/core';
import { DetserviciofaenaComponent } from './detserviciofaena/detserviciofaena.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Detserviciofaenatemp, Serviciofaena } from 'src/app/model/serviciofaena.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ServiciofaenaService } from 'src/app/service/serviciofaena.service';
import { AnimalesService } from 'src/app/service/animales.service';
import { Clientes } from 'src/app/model/clientes.model';
import { ClientesService } from 'src/app/service/clientes.service';
import { Animales } from 'src/app/model/animales.model';
import { Tiposervicios } from 'src/app/model/tiposervicios.model';
import { TiposerviciosService } from 'src/app/service/tiposervicios.service';
import { Guiasenasag } from 'src/app/model/guiasenasag.model';
import { GuiasenasagService } from 'src/app/service/guiasenasag.service';
import { Subject } from 'rxjs';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-g-serviciofaena',
  templateUrl: './g-serviciofaena.component.html',
  styleUrls: ['./g-serviciofaena.component.css']
})
export class GServiciofaenaComponent implements OnInit {

  @ViewChild(DetserviciofaenaComponent) detalleServiciofaena: DetserviciofaenaComponent;

  form: FormGroup;
  formFiltro: FormGroup;
  formdet: FormGroup;
  submitted = false;

  total = 0;
  serfaenaI: Serviciofaena;
  clientesI: Clientes;
  detserfaI: Detserviciofaenatemp;
  animalesI: Animales;
  tiposerviciosI: Tiposervicios;
  guiasenasagI: Guiasenasag;

  serfaLast: any;

  apiSerfaena: any;
  apiAnimales: any;
  apiClientes: any;
  apiDetserfa: any;
  apiTiposervicios: any;
  apiDetserfatemp: any;
  apiGuiasenasag: any;

  
  apidetserfa: any[] = [];
  apianimales: any[];
  apiAnimalesaux: any[] = []; // Inicialización como array vacío
  animalesFiltrados = []; // Lista filtrada de animales
  animalSeleccionado = null; // Animal seleccionado

  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage: string;
  modalReference: NgbModalRef;  //para mensaje
  modalReference2: NgbModalRef;

  tiposServiciosFiltrados = [];



  clienteCtrl = new FormControl(); // Control reactivo para búsqueda de clientes
  filteredClientes: any[] = []; // Lista de clientes filtrados
  mostrarLista = false; // Controla si mostrar la lista de sugerencias
  clienteSeleccionado: any; // Cliente seleccionado
  interactuandoConLista = false; // Indica si el usuario está interactuando con la lista

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private serfaS: ServiciofaenaService,
    private aniS: AnimalesService,
    private cliS: ClientesService,
    private tipserS: TiposerviciosService,
    private guiS: GuiasenasagService,
  ) {

    // Escucha cambios en el input para realizar el filtrado automáticamente
    this.clienteCtrl.valueChanges.subscribe(value => {
      if (value && value.length > 1) { // Filtra solo si hay más de un carácter
        this.filtrarClientes(value);
      } else {
        this.filteredClientes = [];
      }
    });


    this.aniS.getAnimalesLista().subscribe(respo => {
      this.apiAnimales = respo;
    });
    this.cliS.getClientesLista().subscribe(respon => {
      this.apiClientes = respon;
    });
    this.tipserS.getTiposerviciosLista().subscribe(respo => {
      this.apiTiposervicios = respo;
    });
    this.serfaS.eliminarDetserfatemptodo(1).subscribe(respon => { });
    this.actualizarlistatemp();
  }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      fecser: ['', [Validators.required, this.todayValidator()]],
      impser: [''],
      clientes: ['', [Validators.required]],
    });

    this.formFiltro = this.formBuilder.group({
      idcli: [null],
      estadosSerfa: ['-1', [Validators.required]]
    });
    this.formdet = this.formBuilder.group({
      
      pesani: [{ value: '', disabled: true }],
      preser: [{ value: '', disabled: true }],
      canser: [1], // Valor por defecto de 1
      animales: ['', [Validators.required]],
      tiposervicios: ['', [Validators.required]],
    });

    this.serfaS.getDetserfaLista().subscribe((data: any[]) => {
      this.apiDetserfa = data;
      console.log(this.apiDetserfa);
    });


    this.serfaS.getAnimaleslistas().subscribe((data: Animales[]) => {
      this.apianimales = data;
    });

    this.serfaS.getDetserfaListatemp().subscribe(respo => {
      this.apiDetserfatemp = respo;
    });

    this.aniS.getAnimalesLista().subscribe((respo) => {
      this.apiAnimales = respo;
    
      // Suscribirse a valueChanges para el control 'animales'
      this.formdet.get('animales')?.valueChanges.subscribe((idani) => {
        const idAnimalNum = +idani; // Convierte a número si es necesario
        const animalSeleccionado = this.apiAnimales.find(ani => ani.idani === idAnimalNum);
    
        if (animalSeleccionado) {
          // Solo actualiza el campo pesani
          this.formdet.patchValue({
            pesani: animalSeleccionado.pesani
          });
        } else {
          // Si no se encuentra el animal, limpia el campo pesani
          this.formdet.patchValue({
            pesani: ''
          });
        }
      });
    });
    

  }

  get f() { return this.form.controls; }
  get f2() { return this.formFiltro.controls; }
  get f3() { return this.formdet.controls; }

  filtrarNombre(): void {
    const idcli = this.formFiltro.value.idcli;
    const estadosSerfa = this.formFiltro.value.estadosSerfa;
    console.log("filtrar..", idcli, estadosSerfa);
    this.detalleServiciofaena.onChangeFiltroNombre(idcli, estadosSerfa);
    this.serfaS.buscarSerfa(idcli, estadosSerfa).subscribe(respon => {
      this.apiSerfaena = respon;
    })
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
      fecser: localDate,
      impser: '',
      clientes: ''
    });

    this.serfaS.eliminarDetserfatemptodo(1).subscribe(() => {
      this.actualizarlistatemp(); // actualizar la lista temporal después de limpiar
      this.total = 0; // resetear total

      // Retrasar la apertura del modal para asegurar que el formulario se actualice
      setTimeout(() => {
        this.modalReference = this.modalService.open(modal, { size: 'lg', centered: true });

      }, 0);
    });
  }

  cancelar() {
    this.modalReference.close();  //para cerrar
    this.serfaS.eliminarDetserfatemptodo(1).subscribe(resp => {
      this.actualizarlistatemp(); // actualizar la lista temporal después de limpiar
      this.total = 0; // resetear total
    });
  }

  idcomaux: number;
  // servicio de faena 
  onSubmit() {
    this.submitted = true;
  
    // Validar si el formulario es inválido
    if (this.form.invalid) {
      return;
    }
  
    // Validar si un cliente ha sido seleccionado
    if (!this.form.controls.clientes.value) {
      console.error("Debe seleccionar un cliente.");
      return;
    }
  
    // Buscar cliente
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
  
    // Obtener el último número de servicio de faena
    this.serfaS.getServiciofaenaOrden().subscribe((lastSerfaena: Serviciofaena) => {
      let lastNumfae = lastSerfaena && lastSerfaena.numfae ? lastSerfaena.numfae : 0; // Si no hay registros, iniciar en 0
      let newNumfae = lastNumfae === 0 ? 1 : lastNumfae + 1; // Comenzar en 1 si no hay registros
  
      this.serfaenaI = {
        idserfae: 0,
        fecser: this.form.controls.fecser.value,
        impser: this.total,
        numfae: newNumfae,
        estado: 1,
        clientes: this.clientesI,
      };
  
      // Validar si `total` tiene un valor válido
      if (!this.total || this.total <= 0) {
        console.error("El total del servicio no puede ser cero o negativo.");
        return;
      }
  
      // Guardar serviciofaena
      this.serfaS.saveServiciofaena(this.serfaenaI).subscribe(response => {
        this.serfaS.getServiciofaenaOrden().subscribe(respo => {
          this.serfaLast = respo;
          this.idcomaux = this.serfaLast.idserfae;
  
          for (let i = 0; i < this.apiDetserfatemp.length; i++) {
            this.apiDetserfa[i] = this.apiDetserfatemp[i];
            this.apiDetserfa[i].idserfae = this.idcomaux;
  
            this.serfaS.saveDetserfa(this.apiDetserfa[i]).subscribe(resp => {
              // manejar respuesta
            });
          }
  
          this.cancelar();
          this.detalleServiciofaena.listarSerfaena();
  
          // Limpia el buscador de clientes después de guardar
          this.form.controls['clientes'].setValue(''); // Limpia el campo del formulario
          this.clienteCtrl.setValue(''); // Limpia el input del buscador
          this.filteredClientes = []; // Limpia la lista filtrada
          this.clienteSeleccionado = null; // Reinicia el cliente seleccionado
        });
      }, error => {
        console.log("Error while saving data in the DB");
  
        // Manejo de filtros en caso de error
        this.formFiltro.controls.idcli.setValue(null);
        this.formFiltro.controls.estadosSerfa.setValue('-1');
        this.detalleServiciofaena.onChangeFiltroNombre(null, -1);
      });
  
      this._success.next(`Los Datos se GUARDARON Satisfactoriamente..!`); // para mensaje
    });
  }
  
  
  ontiposerviciosChange() {
    const selectedTiposerviciosId = parseInt(this.formdet.get('tiposervicios').value, 10);
    const selectedTiposervicios = this.apiTiposervicios.find(tips => tips.idtipser === selectedTiposerviciosId);
    if (selectedTiposervicios) {
      this.formdet.get('preser').setValue(selectedTiposervicios.preser);
    } else {
      this.formdet.get('preser').setValue('');
    }

  }

  filtrarAnimales(busqueda: string): void {
    const busquedaLower = busqueda.toLowerCase();

    this.serfaS.buscarAniSerfa(busqueda).subscribe((animales) => {
      this.animalesFiltrados = animales.filter(animal =>
        animal.razas.nomraz.toLowerCase().includes(busquedaLower) || // Buscar por nombre de raza
        animal.guiasenasag.nroguia.toString().includes(busqueda) || // Buscar por número de guía
        animal.pesani.toString().includes(busqueda) // Buscar por peso
      );
    });
  }

  seleccionarAnimal(animal: Animales): void {
    this.animalSeleccionado = animal;
    this.tiposServiciosFiltrados = this.apiTiposervicios.filter(
      (tipoServicio) => tipoServicio.tipoanimal.idtip === animal.tipoanimal.idtip
    );

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



  actualizarlistatemp() {
    this.serfaS.getDetserfaListatemp().subscribe(respon => {
      this.apiDetserfatemp = respon;
    })
  }


  pesoing: number = 0;
  impser: number = 0;

  calcularTotaldet() {
    this.impser = this.pesoing;
    for (const det of this.apidetserfa) {
      this.impser += det.pesoing;
    }
    console.log('impser:', this.impser);
  }

  actualizarSubtotal() {
    this.calcularTotaldet();
  }

  llamaModaldet(modal) {
    this.submitted = false;
    this.formdet.reset([{ animales: '' }, { preser: '' }, { subser: '' }, { canser: '' }, { totser: '' }]);
    this.serfaS.getDetserfaLista().subscribe(respo => {
      this.apiDetserfa = respo;
    });
    this.actualizarSubtotal();
    this.modalReference2 = this.modalService.open(modal, { 
      size: 'lg', 
      centered: true // Esto asegura que el modal se centre en la pantalla
    });
  }

  onDetcompras() {
    this.actualizarlistatemp();
    this.submitted = true;
    if ((this.formdet.invalid) == true) {
      return;
    }

    for (let i = 0; i < this.apiAnimales.length; i++) {
      console.log('Valor del formulario:', this.formdet.controls.animales.value);
      console.log('Valor en apiAnimales[' + i + ']:', this.apiAnimales[i].idani);

      if (this.formdet.controls.animales.value == this.apiAnimales[i].idani) {
        console.log('Condición cumplida para índice:', i);
        this.animalesI = this.apiAnimales[i];
        this.total = this.total + this.formdet.controls.preser.value;
        this.apiAnimales.splice(i, 1);
        console.log('Después de splice:', this.apiAnimales);
      }
    }

    for (let i = 0; i < this.apiTiposervicios.length; i++) {
      if (this.formdet.controls.tiposervicios.value == this.apiTiposervicios[i].idtipser) {
        this.tiposerviciosI = this.apiTiposervicios[i];
      }
    }
    this.actualizarSubtotal();
    this.actualizarlistatemp();

    this.detserfaI = {
      idtempser: 0,

      preser: (this.formdet.controls.preser.value),
      idserfae: 0,
      canser: 1,
      animales: this.animalesI,
      tiposervicios: this.tiposerviciosI,
      serviciofaena: this.serfaenaI,
      estado: 1,
    }
    console.log(this.formdet.valid);
    this.detalleServiciofaena.listarSerfaena();

    this.serfaS.saveDetserfatemp(this.detserfaI).subscribe(respo => {
      this.serfaS.getDetserfaListatemp().subscribe(respo => {
        this.apiDetserfatemp = respo;
      });

      this.modalReference2.close();  //para cerrar el modal si todo es exitoso
      this._success.next(`Los Datos se GUARDARON Satisfactoriamente..!`);  //para mensaje

    },
      error => {
        console.log("error while saving data in the DB");
      }
    );
  }

  eliminardet(idtempser: number, preser: number, idani: number) {
    this.serfaS.eliminarDetserfatemp(idtempser).subscribe(
      () => {
        console.log('Detalle de compra eliminado con éxito');
        this.actualizarlistatemp();
        this.actualizarSubtotal();
        this.aniS.getAnimalesLista().subscribe(respo => {
          this.apiAnimales = respo;
          for (let i = 0; i < this.apiAnimalesaux.length; i++) {
            if (this.apiAnimalesaux[i].idani == idani) {
              this.apiAnimales.push(this.apiAnimalesaux[i]);
            }
          }
        });
        this.total -= preser;
      },
      (error) => {
        console.error('Error al eliminar el detalle de compra', error);
      }
    );
  }
}

