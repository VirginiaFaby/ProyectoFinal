import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Menus } from '../model/menus.model';
import { Mepro } from '../model/mepro.model';
import { Procesos } from '../model/procesos.model';

@Injectable({
  providedIn: 'root'
})
export class MenusService {
  
  private baseUrl = '/api'; 

  constructor(private http: HttpClient) {

   }

  getMenproLista(){
    return this.http.get(this.baseUrl+'/listamepro');
  }   

  ///menu 
  getMenproListas(): Observable<Mepro[]> {
    return this.http.get<Mepro[]>(this.baseUrl + '/listamepro');
  }
  

  getRolesLista(xlogin: string, xtoken: string): Observable<any> {
    const httpHeaders = new HttpHeaders ({
      'Content-Type': 'application/json',
      'Authorization': xtoken
    });
    return this.http.get(this.baseUrl + '/listarolusu_login/' + xlogin, {headers: httpHeaders});
  }
    
  getRolmenLista(){
    return this.http.get(this.baseUrl+'/listarolme');
  }

  

  //CRUD DE MENUS 
  getMenusLista(){
    return this.http.get(this.baseUrl+'/listaMenus');
  }

  saveMenus(men : Menus) : Observable<any> {  
    let url = this.baseUrl + "/addMen";
    console.log(men);  
    return this.http.post(url, men);  
  }

  modificarMenus(idmen: number, men : Menus) : Observable<any> {  
    let url = this.baseUrl + "/modMen/"+ idmen;  
    return this.http.put(url,men);  
  }

  deleteMenus(xidmen: number){
    let url = this.baseUrl + "/delMen/" +xidmen;
    return this.http.put(url, xidmen);
  }

  habilitarMenus(xidmen: number){
    let url = this.baseUrl + "/habMen/" +xidmen;
    return this.http.put(url, xidmen);
  }
  
  getMenusListaNombres(nombre:string, estado){
    let url = this.baseUrl + '/listaMenusNombres';
    console.log(nombre);
    console.log(estado);
    return this.http.get(url, { params: new HttpParams() .set('nombre', nombre) .set('estado', estado)})
  }

   // Método para guardar asignaciones

  asignarMenusAProcesos(idmen: number, idpros: number[]): Observable<any> {
    const url = `${this.baseUrl}/asignarMenusProcesos`;

    // Configuración de encabezados si es necesario
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    // Realizar la petición POST al backend
    return this.http.post<void>(`${url}?idmen=${idmen}`, idpros, httpOptions);
  }

  getMenus(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/listaMenus`); // Ajusta la ruta según tu API.
  }

  // Método para obtener los procesos filtrados por idmen
  getProcesosPorMenu(idmen: number): Observable<Procesos[]> {
    return this.http.get<Procesos[]>(`${this.baseUrl}/procesosPorMenu`, {
      params: { idmen: idmen.toString() }
    });
  }

    // Método nuevo para eliminar la asignación
    eliminarAsignacion(idmen: number, idpro: number): Observable<any> {
      return this.http.delete(`${this.baseUrl}/asignacion/${idmen}/${idpro}`);
    }


}
