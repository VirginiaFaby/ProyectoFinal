import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tiposervicios } from '../model/tiposervicios.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TiposerviciosService {

  private baseUrl = '/api';

  constructor( private http: HttpClient) { }

  //Listar 
  getTiposerviciosLista(){
    return this.http.get(this.baseUrl+'/listaTiposervicios');
  }

  //Filtro
  getTipsNomser( nomser : string, estado){
    let url = this.baseUrl + '/listaTipsNomser';
    console.log(nomser);
    console.log(estado);
    return this.http.get(url, { params: new HttpParams() .set('nomser', nomser) .set('estado', estado)})
  }



  listaTipsNom(nomser: string, idtip: number, estado: number) {
    let url = this.baseUrl + '/listaTipsNom'; 
    console.log(nomser);
    console.log(idtip);
    console.log(estado);
    return this.http.get(url, { params: new HttpParams().set('nomser', nomser).set('idtip', idtip.toString()).set('estado', estado.toString()) });
  }


  //Adicionar 
  saveTiposervicios( tips : Tiposervicios) : Observable<any> {  
    let url = this.baseUrl + "/addTips";  
    return this.http.post(url, tips);  
  }

  //Modificar 
  modificarTiposervicios( idtipser: number, tips : Tiposervicios) : Observable<any> {  
    let url = this.baseUrl + "/modTips/"+ idtipser;  
    return this.http.put(url, tips);  
  }

  //Eliminacion logica 
  deleteTiposervicios( idtipser : number) : Observable<any> {
    let url = this.baseUrl + "/delTips/"+ idtipser;  
    return this.http.put(url, idtipser); 
  }

  //Habilitar 
  habilitarTiposervicios( idtipser : number) : Observable<any> {
    let url = this.baseUrl + "/habTips/"+ idtipser;  
    return this.http.put(url, idtipser); 
  }

}
