import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Camara } from '../model/camara.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CamaraService {

  private baseUrl = '/api';

  constructor(private http: HttpClient) { }

  getCamaraLista() {
    return this.http.get(this.baseUrl + '/listaCamara');
  }

  //filtrar por nombre 
  getCamNomcam(nomcam: string, estado) {
    let url = this.baseUrl + '/listaCamNomcam';
    console.log(nomcam);
    console.log(estado);
    return this.http.get(url, { params: new HttpParams().set('nomcam', nomcam).set('estado', estado) })
  }

  saveCamara(cam: Camara): Observable<string> {
    const url = this.baseUrl + "/GuardarCam";
    return this.http.post<string>(url, cam);
  }

  modificarCamara(idcamfri: number, cam: Camara): Observable<string> {
    const url = this.baseUrl + "/modCam/" + idcamfri;
    return this.http.put<string>(url, cam);
  }
  deleteCamara(idcamfri: number): Observable<any> {
    let url = this.baseUrl + "/delCam/" + idcamfri;
    return this.http.put(url, idcamfri);
  }

  habilitarCamara(idcamfri: number): Observable<any> {
    let url = this.baseUrl + "/habCam/" + idcamfri;
    return this.http.put(url, idcamfri);
  }


  // Método para actualizar una cámara sin interpolación de cadenas
  updateCamara(id: number, camaraDetails: Camara): Observable<Camara> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = this.baseUrl + '/' + id;  // Construcción del URL sin interpolación
    return this.http.put<Camara>(url, camaraDetails, { headers });
  }

   // Método para obtener una cámara por ID
   getCamara(id: number): Observable<Camara> {
    return this.http.get<Camara>(`${this.baseUrl}/camaras/${id}`);
  }

}
