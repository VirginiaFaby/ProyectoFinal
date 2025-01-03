  import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Departamentos, Guiasenasag, Oficinalocal, Provincias } from '../model/guiasenasag.model';
import { Observable } from 'rxjs';
import { Animales } from '../model/animales.model';

@Injectable({
  providedIn: 'root'
})
export class GuiasenasagService {

  private baseUrl = '/api';

  constructor(private http: HttpClient) { }

  getGuiasenasagLista() {
    return this.http.get(this.baseUrl + '/listaGuiasenasag');
  }

  getGuiasenasagListas(): Observable<Guiasenasag[]> {
    return this.http.get<Guiasenasag[]>(this.baseUrl + '/listaGuiasenasag');
  }

  //lista de departamentos 
  getDepartamentoslista() {
    return this.http.get(this.baseUrl + '/listaDepartamentos');
  }

  getDepartamentoslistas(): Observable<Departamentos[]> {
    return this.http.get<Departamentos[]>(this.baseUrl + '/listaDepartamentos');
  }

  //lista de Provicias 
  getProvinciasLista() {
    return this.http.get(this.baseUrl + '/listaProvincias');
  }

  getProvinciasListas(): Observable<Provincias[]> {
    return this.http.get<Provincias[]>(this.baseUrl + '/listaProvincias');
  }

  //lista de Municipios 
  getMunicipioslista() {
    return this.http.get(this.baseUrl + '/listaMunicipios');
  }

  //lista de Oficina Local 
  getOficinaLocallista() {
    return this.http.get(this.baseUrl + '/listaOficinalocal');
  }

  getOficinalocalListas(): Observable<Oficinalocal[]> {
    return this.http.get<Oficinalocal[]>(this.baseUrl + '/listaOficinalocal');
  }

  //listar municipios
  listarProvinciasPorDepartamento(iddep: number): Observable<any[]> {
    const url = this.baseUrl + '/pordepartamento/' + iddep;
    return this.http.get<any[]>(url);
  }

  listarMunicipiosPorProvincia(idprovin: number): Observable<any[]> {
    const url = this.baseUrl + '/porprovincia/' + idprovin;
    return this.http.get<any[]>(url);
  }

  listarOficinasLocalesPorDepartamento(iddep: number): Observable<any[]> {
    const url = this.baseUrl + '/pordepartamentoofi/' + iddep;
    return this.http.get<any[]>(url);
  }
  /*buscar grnjas  */
  buscarGranjas(filtro?: string): Observable<any[]> {
    const params: any = filtro ? { filtro } : {};
    return this.http.get<any[]>(`${this.baseUrl}/granjas`, { params });
  }

  // Método para buscar ventas basado en idcli y estado
  listagui(idgranja?: number, estado?: number): Observable<Guiasenasag[]> {
    let params = new HttpParams();

    // Si los parámetros son proporcionados, agrégalos a la solicitud
    if (idgranja != null) {
      params = params.append('idgranja', idgranja.toString());
    }
    if (estado != null) {
      params = params.append('estado', estado.toString());
    }

    // Realiza la solicitud GET con los parámetros
    return this.http.get<Guiasenasag[]>(`${this.baseUrl}/listarguia`, { params });
  }


  saveGuiasenasag(guia: Guiasenasag): Observable<any> {
    let url = this.baseUrl + "/addGuia";
    return this.http.post(url, guia);
  }

  modificarGuiasenasag(idguisen: number, guia: Guiasenasag): Observable<any> {
    let url = this.baseUrl + "/modGui/" + idguisen;
    return this.http.put(url, guia);
  }

  deleteGuiasenasag(idguisen: number): Observable<any> {
    let url = this.baseUrl + "/eliGuia/" + idguisen;
    return this.http.delete(url);
  }


  habilitarGuiasenasag(idguisen: number): Observable<any> {
    let url = this.baseUrl + "/habGui/" + idguisen;
    return this.http.put(url, idguisen);
  }



  asignarCorral(idguisen: number, xidcorral: number): Observable<any> {
    const url = this.baseUrl + '/' + idguisen + '/asigcorral/' + xidcorral;
    return this.http.post(url, null); // Puedes enviar datos en el cuerpo si es necesario
  }

  //registro de animales 
  // En tu servicio
  registrarAnimales(idguisen: number, animal: Animales): Observable<string> {
    let url = this.baseUrl + "/regiani/" + idguisen;
    return this.http.post<string>(url, [animal]); // Envía un array con un solo objeto
  }


  /* buscar por rango de fechas reporte de guas senasag  
  
    buscarGuiasPorFechas(fechaInicio: string, fechaFin: string): Observable<any> {
      let params = new HttpParams()
        .set('fechaInicio', fechaInicio)
        .set('fechaFin', fechaFin);
  
      return this.http.get<any>(this.baseUrl+ "/buscarguias", { params });
    }
  */

  buscarGuiasPorFechas(
    fechaInicio?: string,
    fechaFin?: string,
    idGranja?: number,
    idDepartamento?: number,
    idTipoServicio?: number,
    estado: number = -1
  ): Observable<any> {
    let params = new HttpParams();

    // Añadir parámetros solo si están presentes
    if (fechaInicio) {
      params = params.set('fechaInicio', fechaInicio);
    }

    if (fechaFin) {
      params = params.set('fechaFin', fechaFin);
    }

    if (idGranja !== undefined) {
      params = params.set('idGranja', idGranja.toString());
    }

    if (idDepartamento !== undefined) {
      params = params.set('idDepartamento', idDepartamento.toString());
    }

    if (idTipoServicio !== undefined) {
      params = params.set('idTipoServicio', idTipoServicio.toString());
    }

    // Estado tiene un valor predeterminado de -1 (para incluir todos los estados)
    if (estado !== -1) {
      params = params.set('estado', estado.toString());
    }

    // Llamada HTTP GET con los parámetros opcionales
    return this.http.get<any>(this.baseUrl + "/buscarguias", { params });
  }

  getGranjasLista(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + '/listaGranjas'); // Suponiendo que tienes un endpoint
  }

  getDepartamentoslistar(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + '/listaDepartamentos'); // Suponiendo que tienes un endpoint
  }

  getTiposerviciosLista(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + '/listaTiposervicios'); // Suponiendo que tienes un endpoint
  }

  buscarPorNroGuia(filtro: string): Observable<any> {
    const url = `${this.baseUrl}/buscarnro`;
    return this.http.get<any[]>(url, { params: { filtro } });
  }

}
