import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Compras, Detcompras, Detcomtemp } from '../model/compras.model';
import { Animales } from '../model/animales.model';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  private baseUrl = '/api';

  constructor(private http: HttpClient) { }

  ///Compras 

  getComprasLista() {
    return this.http.get(this.baseUrl + '/listaCompras');
  }

  getCompraslista(): Observable<Compras[]> {
    return this.http.get<Compras[]>(this.baseUrl + '/listaCompras');
  }

  // Método para buscar compras por granjas y estado 
  buscarCompras(idcli?: number, estado?: number): Observable<Compras[]> {
    let params = new HttpParams();

    // Si los parámetros son proporcionados, agrégalos a la solicitud
    if (idcli != null) {
      params = params.append('idgranja', idcli.toString());
    }
    if (estado != null) {
      params = params.append('estado', estado.toString());
    }

    // Realiza la solicitud GET con los parámetros
    return this.http.get<Compras[]>(`${this.baseUrl}/buscarcom`, { params });
  }

  saveCompras(com: Compras): Observable<any> {
    let url = this.baseUrl + "/addCom";
    return this.http.post(url, com);
  }

  getComprasOrden() {
    return this.http.get(this.baseUrl + '/listaCompraOrden');
  }

  // Método para actualizar el estado de los animales relacionados con una compra
  actualizarEstadoAnimalesPorCompra(idcom: number, nuevoEstado: number): Observable<any> {
    // La URL construida debería ser /api/actualizarEstadoPorCompra/{idcom}
    return this.http.put(`${this.baseUrl}/actualizarEstadoPorCompra/${idcom}`, nuevoEstado);
  }

  // Método para eliminar la compra y sus detalles
  eliminarCompraConDetalles(idcom: number): Observable<any> {
    const url = `${this.baseUrl}/eliminarCompraConDetalles/${idcom}`;
    return this.http.delete(url);
  }

  //Detalle de Compras 

  getDetcomprasLista() {
    return this.http.get(this.baseUrl + '/listaDetcompras');
  }

  getDetcomprasByidcom(idcom: number): Observable<any> {
    return this.http.get(this.baseUrl + '/idcom/' + idcom);
  }

  getdetcompLista(): Observable<Detcompras[]> {
    return this.http.get<Detcompras[]>(this.baseUrl + '/listaDetcompras');
  }

  saveDetcompras(detcom: Detcompras): Observable<any> {
    let url = this.baseUrl + "/addDetcom";
    return this.http.post(url, detcom);
  }

  eliminarDetcompra(iddetcom: number): Observable<any> {
    let url = this.baseUrl + "/eliminarDetcom/" + iddetcom;
    return this.http.delete(url);
  }

  //detalle ventas temporal 

  getDetcomprasListatemp() {
    return this.http.get(this.baseUrl + '/listaDetcomtemp');
  }

  getdetcomprasListatemp(): Observable<Detcomtemp[]> {
    return this.http.get<Detcomtemp[]>(this.baseUrl + '/listaDetcomtemp');
  }

  saveDetcomprastemp(detcontemp: Detcomtemp): Observable<any> {
    let url = this.baseUrl + "/addDetcomtemp";
    return this.http.post(url, detcontemp);
  }

  eliminarDetcompratemp(idtempcom: number): Observable<any> {
    let url = this.baseUrl + "/eliminarDetcomtemp/" + idtempcom;
    return this.http.delete(url);
  }

  eliminarDetcompratemptodo(idtempcom: number): Observable<any> {
    let url = this.baseUrl + "/eliminarDetcomtemptodo";
    return this.http.delete(url);
  }

  actualizarEstadoAnimal(idani: number, estado: number): Observable<string> {
    const url = this.baseUrl + '/actualizarEstadoAnimal/' + idani + '/' + estado;
    return this.http.put<string>(url, null); // Especifica el tipo de retorno
  }

  ///////reporte de  Compras 

  // Método para buscar compras 
  buscareporcom(fechaInicio?: string, fechaFin?: string, numcom?: number,
    idGranjas?: number, estado: number = -1): Observable<Compras[]> {
    let params = new HttpParams();

    // Agregar parámetros opcionales solo si están presentes
    if (fechaInicio) {
      params = params.set('fechaInicio', fechaInicio);
    }
    if (fechaFin) {
      params = params.set('fechaFin', fechaFin);
    }
    if (numcom) {
      params = params.set('numcom', numcom.toString());
    }
    if (idGranjas) {
      params = params.set('idGranjas', idGranjas.toString());
    }
    if (estado !== -1) {
      params = params.set('estado', estado.toString());
    }

    return this.http.get<Compras[]>(`${this.baseUrl}/buscareporcom`, { params });
  }


  ///filtro de animales de detalle de compras 
  buscarAnimalesPorFiltro(filtro?: string): Observable<Animales[]> {
    const url = `${this.baseUrl}/buscaranidetcom`;
    return this.http.get<Animales[]>(url, { params: { filtro: filtro || '' } });
  }

}
