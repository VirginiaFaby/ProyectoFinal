import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Detventas, Detventastemp, Ventas } from '../model/ventas.model';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  private baseUrl = '/api';

  constructor(private http: HttpClient) { }

  //ventas

  getVentasLista() {
    return this.http.get(this.baseUrl + '/listaventas');
  }

  // Método para buscar ventas basado en idcli y estado
  buscarVentas(idcli?: number, estado?: number): Observable<Ventas[]> {
    let params = new HttpParams();

    // Si los parámetros son proporcionados, agrégalos a la solicitud
    if (idcli != null) {
      params = params.append('idcli', idcli.toString());
    }
    if (estado != null) {
      params = params.append('estado', estado.toString());
    }

    // Realiza la solicitud GET con los parámetros
    return this.http.get<Ventas[]>(`${this.baseUrl}/buscarven`, { params });
  }

  saveVentas(ven: Ventas): Observable<any> {
    let url = this.baseUrl + "/addVenta";
    return this.http.post(url, ven);
  }

  getVentasOrden() {
    return this.http.get(this.baseUrl + '/listaVentasOrden');
  }

  eliminarVentas(idven: number): Observable<void> {
    const url = `${this.baseUrl}/eliminarVentas/${idven}`;
    return this.http.delete<void>(url);
  }


  //detalle de ventas 

  getDetventasLista() {
    return this.http.get(this.baseUrl + '/listaDetventas');
  }

  getDetvenByidven(idven: number): Observable<any> {
    return this.http.get(this.baseUrl + '/idven/' + idven);
  }

  getdetvenLista(): Observable<Detventas[]> {
    return this.http.get<Detventas[]>(this.baseUrl + '/listaDetventas');
  }

  saveDetventas(detven: Detventas): Observable<any> {
    let url = this.baseUrl + "/adddetven";
    return this.http.post(url, detven);
  }

  eliminarDetventas(iddetven: number): Observable<any> {
    let url = this.baseUrl + "/eliminarDetven/" + iddetven;
    return this.http.delete(url);
  }

  //detalle de detventastemp

  getDetventasListatemp() {
    return this.http.get(this.baseUrl + '/listaDetventemp');
  }

  getdetventasListatemp(): Observable<Detventastemp[]> {
    return this.http.get<Detventastemp[]>(this.baseUrl + '/listaDetventemp');
  }
  saveDetventastemp(detventemp: Detventastemp): Observable<any> {
    let url = this.baseUrl + "/addDetventemp";
    return this.http.post(url, detventemp);
  }

  eliminarDetventemp(idtempven: number): Observable<any> {
    let url = this.baseUrl + "/eliminarDetventemp/" + idtempven;
    return this.http.delete(url);
  }

  eliminarDetventemptodo(idtempven: number): Observable<any> {
    let url = this.baseUrl + "/eliminarDetventemptodo";
    return this.http.delete(url);
  }


  ///////reporte de  Ventas  

  // Método para buscar servicio de faena
  buscareporven(fechaInicio?: string, fechaFin?: string, numven?: number,
    idCliente?: number, estado: number = -1): Observable<Ventas[]> {
    let params = new HttpParams();

    // Agregar parámetros opcionales solo si están presentes
    if (fechaInicio) {
      params = params.set('fechaInicio', fechaInicio);
    }
    if (fechaFin) {
      params = params.set('fechaFin', fechaFin);
    }
    if (numven) {
      params = params.set('numven', numven.toString());
    }
    if (idCliente) {
      params = params.set('idCliente', idCliente.toString());
    }
    if (estado !== -1) {
      params = params.set('estado', estado.toString());
    }

    return this.http.get<Ventas[]>(`${this.baseUrl}/buscareporven`, { params });
  }

  // Método para obtener las estadísticas de razas
  getEstadisticasRazDetventas(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/estarazdetventa`);
  }


}
