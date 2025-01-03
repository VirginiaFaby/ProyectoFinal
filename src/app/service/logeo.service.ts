import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogeoService {
  private  logeado:boolean=false;
  constructor(private http: HttpClient) { }

  getPersona(xuser: string, xclave: string): Observable<any> {
    const body = new HttpParams()
      .set('login', xuser)
      .set('password', xclave);

    return this.http.post("/api/login", 
      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    );
  }
  conectado(){
    return this.logeado;
  }
  selogeo(){
    this.logeado=true;
  }
  sedeslogeo(){
    this.logeado=false
  }

}
