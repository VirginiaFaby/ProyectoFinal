import { Component, OnInit } from '@angular/core';
import { RolesService } from 'src/app/service/roles.service';
import { UsuariosService } from 'src/app/service/usuarios.service';

@Component({
  selector: 'app-g-asigrolusu',
  templateUrl: './g-asigrolusu.component.html',
  styleUrls: ['./g-asigrolusu.component.css']
})
export class GAsigrolusuComponent implements OnInit {
 
  apiRoles: any;
  apiUsuarios: any;
  usuariosFiltrados: any = []; 
  busquedaUsuario: string = '';

  procesosAsignados: number[] = [];
  estadoFiltro: number = -1;
  filteredRoles: any = [];
  selectedRoles: number[] = [];
  selectedUsu: string | null = null;
  

  constructor(
    private rolS: RolesService,
    private usuS: UsuariosService,
  ) { 
    this.rolS.getRolesLista().subscribe( response =>{
      this.apiRoles = response;
    });
  }

  ngOnInit(): void {

    this.usuS.getUsuariosLista().subscribe(response => {
      this.apiUsuarios = response;
      this.usuariosFiltrados = [...this.apiUsuarios]; // Inicializar con todos los menús
      if (this.apiUsuarios.length > 0) {
        // Seleccionar el primer menú por defecto y cargar procesos
        this.selectUsuario(this.apiUsuarios[0].login);
      }
    });

    this.rolS.getRolesLista().subscribe(response => {
      this.apiRoles = response;
      this.filtrarRolPorEstado();
    });
  }

  // Método para filtrar los menús por nombre
  filtrarUsuario(): void {
    if (this.busquedaUsuario.trim() === '') {
      // Si no hay término de búsqueda, mostrar todos los menús
      this.usuariosFiltrados = [...this.apiUsuarios];
    } else {
      // Filtrar menús por el término de búsqueda
      this.usuariosFiltrados = this.apiUsuarios.filter(usu =>
        usu.login.toLowerCase().includes(this.busquedaUsuario.toLowerCase())
      );
    }
  }

 

   // Método para seleccionar un usuario y cargar roles asignados
   selectUsuario(login: string): void {
    this.selectedUsu = login;  // Asignar el usuario seleccionado
    this.rolS.getRolesPorUsuario(login).subscribe(response => {
      this.procesosAsignados = response.map(roles => roles.idrol);
    });
  }

  // Filtra los procesos según el estado seleccionado
  filtrarRolPorEstado(): void {
    if (this.estadoFiltro === -1) {
      this.filteredRoles = this.apiRoles;
    } else {
      this.filteredRoles = this.apiRoles.filter(roles => roles.estado === this.estadoFiltro);
    }
  }

  onProcessChange(idrol: number, event: Event): void {
    const checkbox = event.target as HTMLInputElement;

    if (checkbox.checked) {
      // Si se marca el checkbox, agregar el proceso a la lista de selección y asignarlo automáticamente
      this.selectedRoles.push(idrol);
      if (this.selectedUsu !== null) {
        this.rolS.asignarRolusu(this.selectedUsu, [idrol]).subscribe({
          next: () => {
            console.log(`Roles ${idrol} asignado correctamente`);
            // alert(`Proceso ${idpro} asignado correctamente`);
            // Recargar la lista de procesos asignados
            this.loadAssignedProcesses(this.selectedUsu);
          },
          error: (err) => {
            console.error('Error al asignar el proceso:', err);
            //alert('Error al asignar el proceso');
          }
        });
      }
    } else {
      // Si se desmarca el checkbox, eliminar la asignación
      this.selectedRoles = this.selectedRoles.filter(rol => rol !== idrol);
      if (this.selectedUsu !== null) {
        this.rolS.eliminarAsignacionR(this.selectedUsu, idrol).subscribe({
          next: () => {
            console.log(`Asignación de proceso ${idrol} eliminada correctamente`);
            //alert(`Asignación de proceso ${idpro} eliminada correctamente`);
            // Recargar la lista de procesos asignados
            this.loadAssignedProcesses(this.selectedUsu);
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
  loadAssignedProcesses(login : string): void {
    this.rolS.getRolesPorUsuario(login).subscribe(response => {
      this.procesosAsignados = response.map(roles => roles.idrol);
    });
  }





  // Método para agregar/quitar un proceso de la selección
  toggleProcessSelection(idrol: number): void {
    const index = this.selectedRoles.indexOf(idrol);
    if (index === -1) {
      this.selectedRoles.push(idrol); // Agregar si no está en la lista
    } else {
      // Eliminar si ya está y también eliminar la asignación en la base de datos
      this.selectedRoles.splice(index, 1);
      this.rolS.eliminarAsignacionR(this.selectedUsu, idrol).subscribe({
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
  asignarMenus(login: string, idrol: number[]): void {
    this.rolS.asignarRolusu(login, idrol).subscribe({
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
