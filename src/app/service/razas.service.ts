import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Razas } from '../model/razas.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RazasService {

  private baseUrl = '/api';

  constructor( private http: HttpClient) { }

  getRazasLista(){
    return this.http.get(this.baseUrl+'/listaRazas');
  }

   //Filtra por Nombre de la Raza 
   ListaRazasNom(nomraz : string, idtip: number, estado){
    let url = this.baseUrl + '/listaRazasNomraz';
    console.log(nomraz);
    console.log(idtip);
    console.log(estado);
    return this.http.get(url, { params: new HttpParams() .set('nomraz', nomraz).set('idtip', idtip.toString()).set('estado', estado.toString()) });
  }

  //Guardar 
  saveRazas(raz : Razas) : Observable<any> { 
    let url = this.baseUrl + "/AddRaz";  
    return this.http.post(url, raz);  
  }
// Modificar
  modificarRazas(idraz: number, raz : Razas) : Observable<any> {  
  let url = this.baseUrl + "/modRaz/"+ idraz;  
  return this.http.put(url, raz);  
}


  //Eliminacion Logica 
  deleteRazas(idraz: number) : Observable<any> {
    let url = this.baseUrl + "/delRaz/"+ idraz;  
    return this.http.put(url, idraz); 
  }

  //Habilitar 
  habilitarRazas( idraz : number) : Observable<any> {
    let url = this.baseUrl + "/habRaz/"+ idraz;  
    return this.http.put(url, idraz); 
  }




}
