import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Corrales } from '../model/corrales.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CorralesService {

  private baseUrl = '/api';

  constructor( private http: HttpClient ) { }

  getCorralesLista(){
    return this.http.get(this.baseUrl+'/listaCorrales');
  }

  //filtrar por nombre 
  getCorNomcor(nomcor:string, estado){
    let url = this.baseUrl + '/listaCorNomcor';
    console.log(nomcor);
    console.log(estado);
    return this.http.get(url, { params: new HttpParams() .set('nomcor', nomcor) .set('estado', estado)})
  }

  saveCorrales(cor : Corrales) : Observable<any> {  
    let url = this.baseUrl + "/GuardarCor";  
    return this.http.post(url, cor);  
  }

  // envia solo Personas 
  modificarCorrales(idcorral: number, cor : Corrales) : Observable<any> {  
    let url = this.baseUrl + "/modCor/"+ idcorral;  
    return this.http.put(url, cor);  
  }

  deleteCorrales(idcorral: number) : Observable<any> {
    let url = this.baseUrl + "/delCor/"+ idcorral;  
    return this.http.delete(url); 
  }

  MantCorrales( idcorral: number) : Observable<any> {
    let url = this.baseUrl + "/mantCor/"+ idcorral;  
    return this.http.put(url, idcorral); 
  }

  //
  getCorralesListas(): Observable<Corrales[]> {
    return this.http.get<Corrales[]>(this.baseUrl + '/listaCorrales');
  }



}
