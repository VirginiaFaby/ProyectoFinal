import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Detprodcar, Detprodcartemp, ProdCarnicos } from '../model/prodcarnicos.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProdcarnicosService {

  private baseUrl = '/api'; 

  constructor( private http: HttpClient) { }

   //CRUD DE Productos  Carnicos 
   getProduCarnicosLista(){
    return this.http.get(this.baseUrl+'/listaProdCarnicos');
  }

  getProdcarnicosListaNombres(nomprod:string, estado){
    let url = this.baseUrl + '/listaPrdcNombre';
    console.log(nomprod);
    console.log(estado);
    return this.http.get(url, { params: new HttpParams() .set('nomprod', nomprod) .set('estado', estado)})
  }

  saveProdCarnicos(prdc : ProdCarnicos) : Observable<any> {  
    let url = this.baseUrl + "/addPrdc";  
    return this.http.post(url, prdc);  
  }

  modificarProdcarnicos(idprod: number, prdc : ProdCarnicos) : Observable<any> {  
    let url = this.baseUrl + "/modPrdc/"+ idprod;  
    return this.http.put(url,prdc);  
  }

  // Método para eliminar prodcarnicos y actualizar la cámara
  eliminarProdcarnicosYActualizarCamara(prodcarnicosId: number): Observable<any> {
    const url = `${this.baseUrl}/prodcarnicos/${prodcarnicosId}`; // Construir la URL para eliminar el prodcarnicos
    return this.http.delete(url, { responseType: 'text' }); // Enviar la solicitud DELETE
  }


  deleteProdcarnicos(idprod: number) : Observable<any> {
    let url = this.baseUrl + "/delPrdc/"+ idprod;  
    return this.http.put(url,idprod); 
  }

  habilitarProdcarnicos(idprod: number) : Observable<any> {
    let url = this.baseUrl + "/habPrdc/"+ idprod;  
    return this.http.put(url,idprod); 
  }

  getProdcarOrden(){
    return this.http.get(this.baseUrl+'/listaProdCarnicosOrden');
  } 

    //Animales 
    getProdcLisA(): Observable<ProdCarnicos[]> {
      return this.http.get<ProdCarnicos[]>(this.baseUrl + '/listaProdCarnicos');
   }

   // Método para actualizar la cámara con canting y saldo
  updateCamaraSal(idcamfri: number, updatedCamara: any): Observable<any> {
    // URL para la actualización de la cámara
    const url = `${this.baseUrl}/camara/${idcamfri}`;

    // Hacer la petición PUT al servidor, enviando los datos de la cámara actualizados
    return this.http.put(url, updatedCamara, { responseType: 'text' });
  }

  // Servicio para actualizar el estado del producto cárnico
updateProdCarnicoEstado(idprod: number, updatedProdcarnicos: any): Observable<any> {
  const url = `${this.baseUrl}/prodcarnicos/${idprod}`; // URL para actualizar el producto cárnico
  return this.http.put(url, updatedProdcarnicos, { responseType: 'text' });
}






  // detalle de detprodcar 

  getDetprodcarLista(){
    return this.http.get(this.baseUrl+'/listaDetprodcar');
  }

  getDetprodcByidprod( idprod : number): Observable<any> {
    return this.http.get(this.baseUrl + '/idprod/' + idprod);
  }

  getdetprodcarLista(): Observable<Detprodcar[]> {
    return this.http.get<Detprodcar[]>(this.baseUrl+'/listaDetprodcar');
  }

  saveDetprodcar(detprodc : Detprodcar) : Observable<any> {  
    let url = this.baseUrl + "/GuardarDetprodc";  
    return this.http.post(url, detprodc);  
  }

  eliminarDetprodcar(iddetprodc: number): Observable<any> {
    let url = this.baseUrl + "/eliminarDetprodc/"+iddetprodc;
    return this.http.delete(url);
  }

  // detalle de detprodcartemp 

  getDetprodcarListatemp(){
    return this.http.get(this.baseUrl+'/listaDetprodctemp');
  }

  getdetprodcarListatemp(): Observable<Detprodcartemp[]> {
    return this.http.get<Detprodcartemp[]>(this.baseUrl+'/listaDetserfatemp');
  }

  saveDetprodcartemp(detprodct : Detprodcartemp) : Observable<any> {  
    let url = this.baseUrl + "/GuardarDetprodctemp";  
    return this.http.post(url, detprodct);  
  }

  eliminarDetprodcartemp(idtemprodc: number): Observable<any> {
    let url = this.baseUrl + "/eliminarDetprodctemp/"+ idtemprodc;
    return this.http.delete(url);
  }

  eliminarDetprodcartemptodo(idtemprodc : number): Observable<any> {
    let url = this.baseUrl + "/eliminarDetprodctemptodo";
    return this.http.delete(url);
  }
  

}
