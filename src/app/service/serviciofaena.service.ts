import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Detserviciofaena, Detserviciofaenatemp, Serviciofaena } from '../model/serviciofaena.model';
import { Guiasenasag } from '../model/guiasenasag.model';
import { Animales } from '../model/animales.model';

@Injectable({
  providedIn: 'root'
})
export class ServiciofaenaService {

  private baseUrl = '/api';

  constructor(private http: HttpClient) { }

  //Guia Senasag 

  //Guiasenasag 
  getGuiasenasagLista() {
    return this.http.get(this.baseUrl + '/listaGuiasenasag');
  }

  //Animales
  getAnimalesLista() {
    return this.http.get(this.baseUrl + '/listaAnimales');
  }

  //Guiasenasag
  getGuiasenasaglistas(): Observable<Guiasenasag[]> {
    return this.http.get<Guiasenasag[]>(this.baseUrl + '/listaGuiasenasag');
  }

  //Animales 
  getAnimaleslistas(): Observable<Animales[]> {
    return this.http.get<Animales[]>(this.baseUrl + '/listaAnimales');
  }

  //listar animales 
  listarAnimalesPorGuia(nroguia: number): Observable<Animales[]> {
    const url = this.baseUrl + '/porguia/' + nroguia;
    return this.http.get<Animales[]>(url);
  }

  listarAnimalesPorNroguia(nroguia: number): Observable<Animales[]> {
    const url = this.baseUrl + '/guiasenasag/' + nroguia + '/animales'; // Concatenación sin usar template strings
    return this.http.get<Animales[]>(url);
  }

  // Método para obtener los animales por nroguia
  obtenerAnimalesPorNroguia(nroguia: number): Observable<Animales[]> {
    const url = this.baseUrl + '/guia/' + nroguia + '/animales';  // Concatenación simple
    return this.http.get<Animales[]>(url);
  }

  // Método para obtener los animales por nroguia
  obtenerAnimalesNroguia(nroguia: number): Observable<Animales[]> {
    const url = this.baseUrl + '/guia/' + nroguia + '/aniserfa';
    return this.http.get<Animales[]>(url);
  }

  buscarAniSerfa(filtro?: string): Observable<any[]> {
    const params = filtro ? { filtro } : {}; // Agrega el parámetro si existe
    return this.http.get<any[]>(`${this.baseUrl}/buscar`, { params });
  }

  buscarAniCom(filtro?: string): Observable<any[]> {
    const params = filtro ? { filtro } : {}; // Agrega el parámetro si existe
    return this.http.get<any[]>(`${this.baseUrl}/buscarAnicom`, { params });
  }
  
  buscarClientes(filtro?: string): Observable<any[]> {
    const params: any = filtro ? { filtro } : {}; 
    return this.http.get<any[]>(`${this.baseUrl}/clientes`, { params });
  }



  // Servicio de Faena 

  getServiciofaenaLista() {
    return this.http.get(this.baseUrl + '/listaServiciofaena');
  }

  getServfaenaFecser(fecser: string, estado) {
    let url = this.baseUrl + '/listaSerfafil';
    console.log(fecser);
    console.log(estado);
    return this.http.get(url, { params: new HttpParams().set('fecser', fecser).set('estado', estado) });
  }



  // Método para buscar ventas basado en idcli y estado
  buscarSerfa(idcli?: number, estado?: number): Observable<Serviciofaena[]> {
    let params = new HttpParams();

    // Si los parámetros son proporcionados, agrégalos a la solicitud
    if (idcli != null) {
      params = params.append('idcli', idcli.toString());
    }
    if (estado != null) {
      params = params.append('estado', estado.toString());
    }

    // Realiza la solicitud GET con los parámetros
    return this.http.get<Serviciofaena[]>(`${this.baseUrl}/buscarser`, { params });
  }



  saveServiciofaena(serfa: Serviciofaena): Observable<any> {
    let url = this.baseUrl + "/addServiciofaena";
    console.log(serfa);
    return this.http.post<any>(url, serfa);
  }




  // Método para obtener el último registro de serviciofaena
  getServiciofaenaOrden(): Observable<Serviciofaena> {
    return this.http.get<Serviciofaena>(`${this.baseUrl}/listaServiciofaenaOrden`);
  }


  //eliminacion de servicio de faena y detalle de servicio de faena 

  eliminarServicioFaena(idserfae: number): Observable<any> {
    const url = this.baseUrl + '/delSerfa/' + idserfae;
    return this.http.delete(url);
  }

  //detalle de detserviciofaena 

  getDetserfaLista() {
    return this.http.get(this.baseUrl + '/listaDetserfa');
  }

  getdetserfaLista(): Observable<Detserviciofaena[]> {
    return this.http.get<Detserviciofaena[]>(this.baseUrl + '/listaDetserfa');
  }

  saveDetserfa(detserfa: Detserviciofaena): Observable<any> {
    let url = this.baseUrl + "/GuardarDetserfa";
    return this.http.post(url, detserfa);
  }

  eliminarDetserfa(iddetser: number): Observable<any> {
    let url = this.baseUrl + "/eliminarDetserfa/" + iddetser;
    return this.http.delete(url);
  }

  update(id: number, detalle: Detserviciofaena): Observable<any> {
    const url = this.baseUrl + '/detserviciofaena/' + id; // Construir la URL sin interpolación
    return this.http.put<any>(url, detalle);
  }



  //esta es la parte de detalle de temp

  getDetserfaListatemp() {
    return this.http.get(this.baseUrl + '/listaDetserfatemp');
  }

  getdetserfaListatemp(): Observable<Detserviciofaenatemp[]> {
    return this.http.get<Detserviciofaenatemp[]>(this.baseUrl + '/listaDetserfatemp');
  }

  saveDetserfatemp(det: Detserviciofaenatemp): Observable<any> {
    let url = this.baseUrl + "/GuardarDetserfatemp";
    return this.http.post(url, det);
  }

  eliminarDetserfatemp(idtempser: number): Observable<any> {
    let url = this.baseUrl + "/eliminarDetserviciofaenatemp/" + idtempser;
    return this.http.delete<any>(url);
  }
  eliminarDetserfatemptodo(iddetser: number): Observable<any> {
    let url = this.baseUrl + "/eliminarDetserfatemptodo";
    return this.http.delete(url);
  }

  getDetserfaeByIdserfae(idserfae: number): Observable<any> {
    return this.http.get(this.baseUrl + '/idserfae/' + idserfae);
  }

  ///////reporte de servicio de faena 

  // Método para buscar servicio de faena
  buscarServicioFaena(fechaInicio?: string, fechaFin?: string, numFaena?: number, idCliente?: number, estado: number = -1): Observable<Serviciofaena[]> {
    let params = new HttpParams();

    // Agregar parámetros opcionales solo si están presentes
    if (fechaInicio) {
      params = params.set('fechaInicio', fechaInicio);
    }
    if (fechaFin) {
      params = params.set('fechaFin', fechaFin);
    }
    if (numFaena) {
      params = params.set('numFaena', numFaena.toString());
    }
    if (idCliente) {
      params = params.set('idCliente', idCliente.toString());
    }
    if (estado !== -1) {
      params = params.set('estado', estado.toString());
    }

    return this.http.get<Serviciofaena[]>(`${this.baseUrl}/buscarserviciofaena`, { params });
  }


  // Método para obtener las estadísticas de razas
  getEstadisticasRazas(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/estarazas`);
  }


}
