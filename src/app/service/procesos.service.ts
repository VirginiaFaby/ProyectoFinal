import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Procesos } from '../model/procesos.model';

@Injectable({
  providedIn: 'root'
})
export class ProcesosService {

  private baseUrl ='/api';
  
  constructor( private http: HttpClient) { }

  //crud de procesos 
   
  getProcesosLista(){
    return this.http.get(this.baseUrl+'/listaProcesos');
  }

  //guardar procesos 
  saveProcesos( pro : Procesos): Observable<any>{
    let url = this.baseUrl + "/addProcesos";
    console.log(pro);
    return this.http.post(url, pro);
  }

  //filtro 
  getProcesosListaNombres(nombre: string , estado){
    let url =this.baseUrl + '/listaProcesosNombres';
    console.log(nombre);
    console.log(estado);
    return this.http.get(url, { params : new HttpParams().set('nombre', nombre) .set('estado', estado)})
  }

  //modificar 
  modificarProcesos(codpro: number, pro :Procesos): Observable<any>{
    let url = this.baseUrl + "/modProcesos/"+ codpro;
    return this.http.put(url, pro);
  }

  //eliminar 
  deleteProcesos(xcodpro : number){
    let url = this.baseUrl + "/delProcesos/" + xcodpro;
    return this.http.put(url, xcodpro); 
  }

  //habilitar 
  habilitarProcesos(xcodpro: number){
    let url = this.baseUrl + "/habProcesos/" + xcodpro;
    return this.http.put(url, xcodpro);

  }

}
