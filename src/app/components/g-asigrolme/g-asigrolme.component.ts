import { Component, OnInit } from '@angular/core';
import { MenusService } from 'src/app/service/menus.service';
import { RolesService } from 'src/app/service/roles.service';

@Component({
  selector: 'app-g-asigrolme',
  templateUrl: './g-asigrolme.component.html',
  styleUrls: ['./g-asigrolme.component.css']
})
export class GAsigrolmeComponent implements OnInit {

  apiRoles: any;
  apiMenus: any;
  rolesFiltrados: any = []; 
  busquedarol: string = '';

  procesosAsignados: number[] = [];
  estadoFiltro: number = -1;
  filteredMenus: any = [];
  selectedMenus: number[] = [];
  selectedRol: number | null = null;

  

  constructor(
    private menS: MenusService,
    private rolS: RolesService,
  ) { }

  ngOnInit(): void {

    this.rolS.getRolesLista().subscribe(response => {
      this.apiRoles = response;
      this.rolesFiltrados = [...this.apiRoles]; // Inicializar con todos los menús
      if (this.apiRoles.length > 0) {
        // Seleccionar el primer menú por defecto y cargar procesos
        this.selectRoles(this.apiRoles[0].idrol);
      }
    });

    this.menS.getMenusLista().subscribe(response => {
      this.apiMenus = response;
      this.filtrarMenusPorEstado();
    });
  }

    // Método para filtrar los menús por nombre
    filtrarRoles(): void {
      if (this.busquedarol.trim() === '') {
        // Si no hay término de búsqueda, mostrar todos los menús
        this.rolesFiltrados = [...this.apiRoles];
      } else {
        // Filtrar menús por el término de búsqueda
        this.rolesFiltrados = this.apiRoles.filter(rol =>
          rol.nombre.toLowerCase().includes(this.busquedarol.toLowerCase())
        );
      }
    }

      // Método para seleccionar un menú y filtrar procesos
  selectRoles(idrol: number): void {
    this.selectedRol = idrol;
    this.rolS.getMenusPorRol(idrol).subscribe(response => {
      this.procesosAsignados = response.map(men => men.idmen);
    });
  }

    // Filtra los procesos según el estado seleccionado
    filtrarMenusPorEstado(): void {
      if (this.estadoFiltro === -1) {
        this.filteredMenus = this.apiMenus;
      } else {
        this.filteredMenus = this.apiMenus.filter(men =>men.estado === this.estadoFiltro);
      }
    }

    onProcessChange(idmen: number, event: Event): void {
      const checkbox = event.target as HTMLInputElement;
  
      if (checkbox.checked) {
        // Si se marca el checkbox, agregar el proceso a la lista de selección y asignarlo automáticamente
        this.selectedMenus.push(idmen);
        if (this.selectedRol !== null) {
          this.rolS.asignarRolAMenus(this.selectedRol, [idmen]).subscribe({
            next: () => {
              console.log(`Menus ${idmen} asignado correctamente`);
              // alert(`Proceso ${idpro} asignado correctamente`);
              // Recargar la lista de procesos asignados
              this.loadAssignedProcesses(this.selectedRol);
            },
            error: (err) => {
              console.error('Error al asignar el proceso:', err);
              //alert('Error al asignar el proceso');
            }
          });
        }
      } else {
        // Si se desmarca el checkbox, eliminar la asignación
        this.selectedMenus = this.selectedMenus.filter(men => men !== idmen);
        if (this.selectedRol !== null) {
          this.rolS.eliminarAsignacionRolme(this.selectedRol, idmen).subscribe({
            next: () => {
              console.log(`Asignación de menus ${idmen} eliminada correctamente`);
              //alert(`Asignación de proceso ${idpro} eliminada correctamente`);
              // Recargar la lista de procesos asignados
              this.loadAssignedProcesses(this.selectedRol);
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
  loadAssignedProcesses(idrol: number): void {
    this.rolS.getMenusPorRol(idrol).subscribe(response => {
      this.procesosAsignados = response.map(men => men.idmen);
    });
  }

  
  // Método para agregar/quitar un proceso de la selección
  toggleProcessSelection(idmen: number): void {
    const index = this.selectedMenus.indexOf(idmen);
    if (index === -1) {
      this.selectedMenus.push(idmen); // Agregar si no está en la lista
    } else {
      // Eliminar si ya está y también eliminar la asignación en la base de datos
      this.selectedMenus.splice(index, 1);
      this.rolS.eliminarAsignacionRolme(this.selectedRol, idmen).subscribe({
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
    asignarRoles(idrol: number, idmen: number[]): void {
      this.rolS.asignarRolAMenus(idrol, idmen).subscribe({
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
