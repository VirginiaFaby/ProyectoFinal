import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Departamentos } from '../model/departamentos.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartamentosService {

  private baseUrl = '/api';

  constructor( private http: HttpClient ) { }

  getDepartamentosLista(){
    return this.http.get(this.baseUrl+'/listaDepartamentos');
  }

  //filtrar por nombre 
  getDepartamentoNomdep(nomdep : string, estado){
    let url = this.baseUrl + '/listaDepNomdep';
    console.log(nomdep);
    console.log(estado);
    return this.http.get(url, { params: new HttpParams() .set('nomdep', nomdep) .set('estado', estado)})
  }

  saveDepartamento(dep : Departamentos) : Observable<any> {  
    let url = this.baseUrl + "/GuardarDep";  
    return this.http.post(url, dep);  
  }

  // envia solo Personas 
  modificarDepartamento(iddep : number, dep : Departamentos) : Observable<any> {  
    let url = this.baseUrl + "/modDep/"+ iddep;  
    return this.http.put(url, dep);  
  }

  deleteDepartamento(iddep: number) : Observable<any> {
    let url = this.baseUrl + "/delDep/"+ iddep;  
    return this.http.put(url,iddep); 
  }

  habilitarDepartamento(iddep: number) : Observable<any> {
    let url = this.baseUrl + "/habDep/"+ iddep;  
    return this.http.put(url, iddep); 
  }
}
