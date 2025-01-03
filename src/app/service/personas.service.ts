import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Personas } from '../model/personas.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonasService {

  private baseUrl = '/api';

  constructor(private http: HttpClient ) { }

  getPersonasLista(){
    return this.http.get(this.baseUrl+'/listaPersonas');
  }

    //filtrar por nombre 
    getPersonasListaNombres(nombre:string, estado){
      let url = this.baseUrl + '/listaPerNombres';
      console.log(nombre);
      console.log(estado);
      return this.http.get(url, { params: new HttpParams() .set('nombre', nombre) .set('estado', estado)})
    }

    savePersonas(per : Personas) : Observable<any> {  
      let url = this.baseUrl + "/addPer";  
      return this.http.post(url, per);  
    }

    modificarPersonas(idper: number, per : Personas) : Observable<any> {  
      let url = this.baseUrl + "/modPer/"+ idper;  
      return this.http.put(url,per);  
    }

    deletePersonas (idper: number) : Observable<any> {
      let url = this.baseUrl + "/delPer/"+ idper;  
      return this.http.put(url,idper); 
    }

    habilitarPersonas(idper: number) : Observable<any> {
      let url = this.baseUrl + "/habPer/"+ idper;  
      return this.http.put(url,idper); 
    }

}
