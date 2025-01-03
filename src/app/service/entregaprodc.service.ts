import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Entregaprodc } from '../model/entregaprodc.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntregaprodcService {

  private baseUrl = '/api';

  constructor( private http: HttpClient ) { }

  getEntprdcLista(){
    return this.http.get(this.baseUrl+'/listaEntregaprodc');
  }

      //filtrar por nombre 
      getEntprdcDirent(dirent : string, estado){
        let url = this.baseUrl + '/listaEntregaprodcDirent';
        console.log(dirent);
        console.log(estado);
        return this.http.get(url, { params: new HttpParams() .set('dirent', dirent) .set('estado', estado)})
      }
    
      saveEntprdc(entprdc : Entregaprodc ): Observable<string> {
        const url = this.baseUrl  + "/addEntprdc";
        return this.http.post<string>(url, entprdc);
      }
     
      modificarEntprdc(identpro : number, entprdc: Entregaprodc): Observable<string> {
        const url = this.baseUrl + "/modEntprdc/" + identpro;
        return this.http.put<string>(url, entprdc);
    }
      deleteEntprdc(identpro : number) : Observable<any> {
        let url = this.baseUrl + "/delEntprdc/"+ identpro;  
        return this.http.put(url, identpro); 
      }
    
      habilitarEntprdc(identpro : number) : Observable<any> {
        let url = this.baseUrl + "/habEntprdc/"+ identpro;  
        return this.http.put(url, identpro); 
      }
}
