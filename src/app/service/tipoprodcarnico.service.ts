import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tipoprodcarnico } from '../model/tipoprodcarnico.model';

@Injectable({
  providedIn: 'root'
})
export class TipoprodcarnicoService {

  private baseUrl = '/api';

  constructor( private http: HttpClient ) { }

   //Listar 
   getTipoprodcarnicoLista(){
    return this.http.get(this.baseUrl+'/listaTipoprodcarnico');
  }

  //Filtro
  getTipoprodcarnicos( nompro : string, estado){
    let url = this.baseUrl + '/listaTiproNompro';
    console.log(nompro);
    console.log(estado);
    return this.http.get(url, { params: new HttpParams() .set('nompro', nompro) .set('estado', estado)})
  }

  //Adicionar 
  saveTipoprodcarnico( tipp : Tipoprodcarnico) : Observable<any> {  
    let url = this.baseUrl + "/addTipp";  
    return this.http.post(url, tipp);  
  }

  //Modificar 
  modificarTipoprodcarnico( idtipro: number, tipp : Tipoprodcarnico) : Observable<any> {  
    let url = this.baseUrl + "/modTipp/"+ idtipro;  
    return this.http.put(url, tipp);  
  }

  //Eliminacion logica 
  deleteTipoprodcarnico( idtipro : number) : Observable<any> {
    let url = this.baseUrl + "/delTipp/"+ idtipro;  
    return this.http.put(url, idtipro); 
  }

  //Habilitar 
  habilitarTipoprodcarnico(  idtipro : number) : Observable<any> {
    let url = this.baseUrl + "/habTipp/"+ idtipro;  
    return this.http.put(url, idtipro); 
  }
}
