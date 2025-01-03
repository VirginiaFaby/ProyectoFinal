import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Animales} from '../model/animales.model';
import { Observable } from 'rxjs';
import { Tipoanimal } from '../model/tipoanimal.model';
import { Razas } from '../model/razas.model';
import { Guiasenasag } from '../model/guiasenasag.model';

@Injectable({
  providedIn: 'root'
})
export class AnimalesService {

  private baseUrl = '/api';

  constructor(private http: HttpClient) { }

  getAnimalesLista(){
    return this.http.get(this.baseUrl+'/listaAnimales');
  }

 
  

  //filtrar por nombre 
  getCliListaRazsoc(sexo : string, estado){
    let url = this.baseUrl + '/listaAniSexo';
    console.log(sexo);
    console.log(estado);
    return this.http.get(url, { params: new HttpParams() .set('sexo', sexo) .set('estado', estado)})
  }

  saveAnimales(ani : Animales ): Observable<string> {
    const url = this.baseUrl  + "/AddAni";
    return this.http.post<string>(url, ani);
  }
 
  saveGuiaAnimal(idguisen: number, ani : Animales) : Observable<any> {  
    let url = this.baseUrl + "/AddAni/"+ idguisen;  
    return this.http.put(url, ani);  
  }

  modificarAnimales(idani: number, ani: Animales): Observable<string> {
    const url = this.baseUrl + "/modAni/" + idani;
    return this.http.put<string>(url, ani);
}
  deleteAnimales(idani: number) : Observable<any> {
    let url = this.baseUrl + "/delAni/"+ idani;  
    return this.http.delete(url); 
  }

  habilitarAnimales(idani: number) : Observable<any> {
    let url = this.baseUrl + "/habAni/"+ idani;  
    return this.http.put(url, idani); 
  }

  //tipoAnimales 
  getTipoAnimalesLista(){
    return this.http.get(this.baseUrl+'/listaTipoanimal');
  }

  getRazasLista(){
    return this.http.get(this.baseUrl+'/listaRazas');
  }

  //razas por tipo 
  getTipoanimallistas(): Observable<Tipoanimal[]> {
    return this.http.get<Tipoanimal[]>(this.baseUrl + '/listaTipoanimal');
  }

    //razas por tipo 
  getRazaslistas(): Observable<Razas[]> {
     return this.http.get<Razas[]>(this.baseUrl + '/listaRazas');
  }

  //listar razas 
  listarRazasPorTipoAnimal(idtip: number): Observable<Razas[]> {
    const url = this.baseUrl + '/portipoanimal/' + idtip;
    console.log('URL:', url); // Agrega este log
    return this.http.get<Razas[]>(url);
  }



/*
  listarProvinciasPorDepartamento(iddep: number): Observable<any[]> {
    const url = this.baseUrl + '/pordepartamento/' + iddep;
    return this.http.get<any[]>(url);
  }
*/


buscarAnimales(
  fechaInicio?: string,
  fechaFin?: string,
  idGuiasenasag?: number,
  idTipoanimal?: number,
  idCorrales?: number,
  idRazas?: number,
  estado: number = -1,
  pesoMin?: number,
  pesoMax?: number
): Observable<Animales[]> {
  let httpParams = new HttpParams();

  // Agregar parámetros opcionales solo si están presentes
  if (fechaInicio) {
    httpParams = httpParams.set('fechaInicio', fechaInicio);
  }
  if (fechaFin) {
    httpParams = httpParams.set('fechaFin', fechaFin);
  }
  if (idGuiasenasag !== undefined) {
    httpParams = httpParams.set('idGuiasenasag', idGuiasenasag.toString());
  }
  if (idTipoanimal !== undefined) {
    httpParams = httpParams.set('idTipoanimal', idTipoanimal.toString());
  }
  if (idCorrales !== undefined) {
    httpParams = httpParams.set('idCorrales', idCorrales.toString());
  }
  if (idRazas !== undefined) {
    httpParams = httpParams.set('idRazas', idRazas.toString());
  }
  if (estado !== -1) {
    httpParams = httpParams.set('estado', estado.toString());
  }
  if (pesoMin !== undefined) {
    httpParams = httpParams.set('pesoMin', pesoMin.toString());
  }
  if (pesoMax !== undefined) {
    httpParams = httpParams.set('pesoMax', pesoMax.toString());
  }

  return this.http.get<Animales[]>(`${this.baseUrl}/buscarAni`, { params: httpParams });
}

}
