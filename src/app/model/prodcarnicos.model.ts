import { Camara } from "./camara.model";
import { Clientes } from "./clientes.model";
import { Detserviciofaena, Serviciofaena } from "./serviciofaena.model";
import { Tipoanimal } from "./tipoanimal.model";
import { Tipoprodcarnico } from "./tipoprodcarnico.model";

export interface ProdCarnicos{
    
    idprod      : number; 
    fechaing    : string;
    pesotot     : number;
    clientes    : Clientes;
    numpro      : number;
    obserpro    : string; 
    estado      : number;
    
}

export interface Detprodcar{

    iddetprodc          : number;
    pesoing             : number;
    idprod              : number;
    serviciofaena       : Serviciofaena;
    detserviciofaena    : Detserviciofaena;    
    tipoanimal          : Tipoanimal;
    tipoprodcarnico     : Tipoprodcarnico;
    camara              : Camara;
   
}

export interface Detprodcartemp{

    idtemprodc          : number;
    pesoing             : number;
    idprod              : number;
    serviciofaena       : Serviciofaena;
    detserviciofaena    : Detserviciofaena;    
    tipoanimal          : Tipoanimal;
    tipoprodcarnico     : Tipoprodcarnico;
    camara              : Camara;

}