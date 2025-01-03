import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Personas } from '../model/personas.model';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private baseUrl = '/api';

  constructor(private http: HttpClient) { }

  getUsuariosLista() {
    return this.http.get(this.baseUrl + '/listaUsuarios');
  }

  saveUsuario(per: Personas): Observable<any> {
    let url = this.baseUrl + "/addUsu";
    return this.http.post(url, per);
  }

  modificarUsuario(idper: number, per: Personas): Observable<any> {
    let url = this.baseUrl + "/modUsu/" + idper;
    return this.http.put(url, per);
  }


}

