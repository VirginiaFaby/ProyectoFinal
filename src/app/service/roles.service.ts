import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Roles } from '../model/roles.model';
import { Menus } from '../model/menus.model';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private baseUrl = '/api';

  constructor(private http: HttpClient) { }

  //crud de roles
  getRolesLista() {
    return this.http.get(this.baseUrl + '/listaRoles');
  }

  saveRoles(rol: Roles): Observable<any> {
    let url = this.baseUrl + "/addRoles";
    return this.http.post(url, rol);
  }

  getRolesListaNombres(nombre: string, estado) {
    let url = this.baseUrl + '/listaRolesNombres';
    console.log(nombre);
    console.log(estado);
    return this.http.get(url, { params: new HttpParams().set('nombre', nombre).set('estado', estado) })
  }

  modificarRoles(idrol: number, rol: Roles): Observable<any> {
    let url = this.baseUrl + "/modRoles/" + idrol;
    return this.http.put(url, rol);
  }

  deleteRoles(xidrol: number) {
    let url = this.baseUrl + "/delRoles/" + xidrol;
    return this.http.put(url, xidrol);
  }

  habilitarRoles(xidrol: number) {
    let url = this.baseUrl + "/habRoles/" + xidrol;
    return this.http.put(url, xidrol);
  }

  // Método para guardar asignaciones Rolusu 

    asignarRolusu(login: string, idrol: number[]): Observable<void> {
      const url = `${this.baseUrl}/asignarRolusu`;
      
      const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      };
  
      // Realiza la petición POST al backend
      return this.http.post<void>(`${url}?login=${login}`, idrol, httpOptions);
    }

 // Método para obtener todos los usuarios
 getUsuario(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/listaUsuarios`); // Ajusta la ruta si es necesario
}

  // Método para obtener roles asignados a un usuario específico
  getRolesPorUsuario(login: string): Observable<Roles[]> {
    const params = new HttpParams().set('login', login);
    return this.http.get<Roles[]>(`${this.baseUrl}/rolesPorUsuario`, { params });
  }

   // Método para eliminar la asignación de un rol a un usuario
   eliminarAsignacionR(login: string, idrol: number): Observable<void> {
    const url = `${this.baseUrl}/asignacionR/${login}/${idrol}`;
    return this.http.delete<void>(url);
  }

   // Método para guardar asignaciones Rolme 

   asignarRolAMenus(idrol: number, idmen: number[]): Observable<any> {
    const url = `${this.baseUrl}/asignarRolMenus`;

    // Configuración de encabezados si es necesario
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    // Realizar la petición POST al backend
    return this.http.post<void>(`${url}?idrol=${idrol}`, idmen, httpOptions);
  }

  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/listaRoles`); // Ajusta la ruta según tu API.
  }

  // Método para obtener los procesos filtrados por idmen
  getMenusPorRol(idrol: number): Observable<Menus[]> {
    return this.http.get<Menus[]>(`${this.baseUrl}/menusPorRol`, {
      params: { idrol: idrol.toString() }
    });
  }

    // Método nuevo para eliminar la asignación
    eliminarAsignacionRolme(idrol: number, idmen: number): Observable<any> {
      return this.http.delete(`${this.baseUrl}/asignacionRolme/${idrol}/${idmen}`);
    }



}
