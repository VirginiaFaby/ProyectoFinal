import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Clientes } from '../model/clientes.model';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private baseUrl = '/api';

  constructor( private http: HttpClient ) { }

  // Extrae todas las personas
  getClientesLista(){
    return this.http.get(this.baseUrl+'/listaClientes');
  }

  //filtrar por nombre 
  getCliListaRazsoc(nomcli:string, estado){
    let url = this.baseUrl + '/listaClientesNomcli';
    console.log(nomcli);
    console.log(estado);
    return this.http.get(url, { params: new HttpParams() .set('nomcli', nomcli) .set('estado', estado)})
  }
/*
  saveClientes(cli : Clientes) : Observable<any> {  
    let url = this.baseUrl + "/addCli";  
    return this.http.post(url, cli);  
  }
*/
/*
saveClientes(cli: Clientes, foto: File): Observable<any> {
  const formData: FormData = new FormData();
  formData.append('clientes', JSON.stringify(cli));
  formData.append('foto', foto);

  let url = this.baseUrl + "/addCli";
  return this.http.post(url, formData);
}
*/
saveClientes(cli: Clientes): Observable<string> {
  const headers = new HttpHeaders(); // Puedes agregar encabezados personalizados si es necesario
  return this.http.post<string>(`${this.baseUrl}/addCli`, cli, { headers });
}
/*
saveClientes(clientes: Clientes): Observable<string> {
  const formData = new FormData();
  formData.append('foto', clientes.foto as any);

  // Agregar otros campos según sea necesario
  formData.append('nit', clientes.nit.toString());
  formData.append('razsoc', clientes.razsoc);
  formData.append('telefono', clientes.telefono.toString());
  formData.append('direccion', clientes.direccion);
  formData.append('tipaba', clientes.tipaba);
  formData.append('estado', clientes.estado.toString());

  const headers = new HttpHeaders(); // Puedes agregar encabezados personalizados si es necesario

  return this.http.post<string>(`${this.baseUrl}/addCli`, formData, { headers });
}
*/
  // envia solo Personas 
  modificarClientes(idcli: number, cli : Clientes) : Observable<any> {  
    let url = this.baseUrl + "/modCli/"+ idcli;  
    return this.http.put(url, cli);  
  }

  deleteClientes(idcli: number) : Observable<any> {
    let url = this.baseUrl + "/delCli/"+ idcli;  
    return this.http.put(url,idcli); 
  }

  habilitarClientes(idcli: number) : Observable<any> {
    let url = this.baseUrl + "/habCli/"+ idcli;  
    return this.http.put(url,idcli); 
  }

}
