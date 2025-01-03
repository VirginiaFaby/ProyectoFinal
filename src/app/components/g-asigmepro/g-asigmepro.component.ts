import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Mepro } from 'src/app/model/mepro.model';
import { MenusService } from 'src/app/service/menus.service';
import { ProcesosService } from 'src/app/service/procesos.service';

@Component({
  selector: 'app-g-asigmepro',
  templateUrl: './g-asigmepro.component.html',
  styleUrls: ['./g-asigmepro.component.css']
})
export class GAsigmeproComponent implements OnInit {

  apiMenus: any = []; // Inicializar como arreglo
  apiProcesos: any = []; // Inicializar como arreglo
  selectedMenus: number[] = []; // Arreglo para guardar IDs de menús seleccionados
  asignaciones: Mepro[] = []; // Array para las asignaciones a guardar

  filteredProcesos: any = []; // Arreglo para los procesos filtrados por idmen
  selectedMenu: number | null = null; // Variable para el ID del menú seleccionado
  selectedProcesos: number[] = []; // Lista de IDs de procesos seleccionados
  procesosAsignados: number[] = []; // IDs de procesos ya asignados al menú seleccionado

  procesoSeleccionado: any;
  menusFiltrados: any = []; // Lista de menús filtrados
  busquedaMenu: string = ''; // Término de búsqueda
  estadoFiltro: number = -1; // Variable para almacenar el filtro de estado (-1: Todo, 1: Activo, 0: Baja)

  constructor(
    private menS: MenusService,
    private proS: ProcesosService,
  ) {

  }

  ngOnInit(): void {

    this.menS.getMenusLista().subscribe(response => {
      this.apiMenus = response;
      this.menusFiltrados = [...this.apiMenus]; // Inicializar con todos los menús
      if (this.apiMenus.length > 0) {
        // Seleccionar el primer menú por defecto y cargar procesos
        this.selectMenu(this.apiMenus[0].idmen);
      }
    })

    this.proS.getProcesosLista().subscribe(response => {
      this.apiProcesos = response;
      this.filtrarProcesosPorEstado();
    });

  }


  // Método para filtrar los menús por nombre
  filtrarMenus(): void {
    if (this.busquedaMenu.trim() === '') {
      // Si no hay término de búsqueda, mostrar todos los menús
      this.menusFiltrados = [...this.apiMenus];
    } else {
      // Filtrar menús por el término de búsqueda
      this.menusFiltrados = this.apiMenus.filter(menu =>
        menu.nombre.toLowerCase().includes(this.busquedaMenu.toLowerCase())
      );
    }
  }

  // Método para seleccionar un menú y filtrar procesos
  selectMenu(idmen: number): void {
    this.selectedMenu = idmen;
    this.menS.getProcesosPorMenu(idmen).subscribe(response => {
      this.procesosAsignados = response.map(proceso => proceso.idpro);
    });
  }

  // Filtra los procesos según el estado seleccionado
  filtrarProcesosPorEstado(): void {
    if (this.estadoFiltro === -1) {
      this.filteredProcesos = this.apiProcesos;
    } else {
      this.filteredProcesos = this.apiProcesos.filter(proceso => proceso.estado === this.estadoFiltro);
    }
  }

  onProcessChange(idpro: number, event: Event): void {
    const checkbox = event.target as HTMLInputElement;

    if (checkbox.checked) {
      // Si se marca el checkbox, agregar el proceso a la lista de selección y asignarlo automáticamente
      this.selectedProcesos.push(idpro);
      if (this.selectedMenu !== null) {
        this.menS.asignarMenusAProcesos(this.selectedMenu, [idpro]).subscribe({
          next: () => {
            console.log(`Proceso ${idpro} asignado correctamente`);
            // alert(`Proceso ${idpro} asignado correctamente`);
            // Recargar la lista de procesos asignados
            this.loadAssignedProcesses(this.selectedMenu);
          },
          error: (err) => {
            console.error('Error al asignar el proceso:', err);
            //alert('Error al asignar el proceso');
          }
        });
      }
    } else {
      // Si se desmarca el checkbox, eliminar la asignación
      this.selectedProcesos = this.selectedProcesos.filter(pro => pro !== idpro);
      if (this.selectedMenu !== null) {
        this.menS.eliminarAsignacion(this.selectedMenu, idpro).subscribe({
          next: () => {
            console.log(`Asignación de proceso ${idpro} eliminada correctamente`);
            //alert(`Asignación de proceso ${idpro} eliminada correctamente`);
            // Recargar la lista de procesos asignados
            this.loadAssignedProcesses(this.selectedMenu);
          },
          error: (err) => {
            console.error('Error al eliminar la asignación:', err);
            //alert('Error al eliminar la asignación');
          }
        });
      }
    }
  }

  // Método para recargar los procesos asignados
  loadAssignedProcesses(idmen: number): void {
    this.menS.getProcesosPorMenu(idmen).subscribe(response => {
      this.procesosAsignados = response.map(proceso => proceso.idpro);
    });
  }





  // Método para agregar/quitar un proceso de la selección
  toggleProcessSelection(idpro: number): void {
    const index = this.selectedProcesos.indexOf(idpro);
    if (index === -1) {
      this.selectedProcesos.push(idpro); // Agregar si no está en la lista
    } else {
      // Eliminar si ya está y también eliminar la asignación en la base de datos
      this.selectedProcesos.splice(index, 1);
      this.menS.eliminarAsignacion(this.selectedMenu, idpro).subscribe({
        next: () => {
          console.log('Asignación eliminada correctamente');
        },
        error: (err) => {
          console.error('Error al eliminar la asignación:', err);
        }
      });
    }
  }




  // Método para guardar las asignaciones
  asignarMenus(idmen: number, idpros: number[]): void {
    this.menS.asignarMenusAProcesos(idmen, idpros).subscribe({
      next: () => {
        console.log('Asignaciones guardadas correctamente');
        alert('Asignaciones guardadas correctamente');
      },
      error: (err) => {
        console.error('Error al guardar las asignaciones:', err);
        alert('Error al guardar las asignaciones');
      }
    });
  }



}
