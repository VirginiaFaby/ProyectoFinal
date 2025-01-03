import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Granjas } from '../model/granjas.model';

@Injectable({
  providedIn: 'root'
})
export class GranjasService {

  private baseUrl = '/api';

  constructor( private http: HttpClient ) { }

  //Listar 
  getGranjasLista(){
    return this.http.get(this.baseUrl+'/listaGranjas');
  }

  //Filtro
  listaGranjasNom(nomgra: string, idtip: number, estado: number) {
    let url = this.baseUrl + '/listaGranjasNom'; 
    console.log(nomgra);
    console.log(idtip);
    console.log(estado);
    return this.http.get(url, { params: new HttpParams().set('nomgra', nomgra).set('idtip', idtip.toString()).set('estado', estado.toString()) });
  }


  //Adicionar 
  saveGranjas( gra : Granjas) : Observable<any> {  
    let url = this.baseUrl + "/addGra";  
    return this.http.post(url, gra);  
  }

  //Modificar 
  modificarGranjas( idgranja: number, gra : Granjas) : Observable<any> {  
    let url = this.baseUrl + "/modGra/"+ idgranja;  
    return this.http.put(url, gra);  
  }

  //Eliminacion logica 
  deleteGranjas( idgranja : number) : Observable<any> {
    let url = this.baseUrl + "/delGra/"+ idgranja;  
    return this.http.put(url, idgranja); 
  }

  //Habilitar 
  habilitarGranjas( idgranja : number) : Observable<any> {
    let url = this.baseUrl + "/habGra/"+ idgranja;  
    return this.http.put(url, idgranja); 
  }

}
