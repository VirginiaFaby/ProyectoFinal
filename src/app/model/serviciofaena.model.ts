import { Animales } from "./animales.model";
import { Clientes } from "./clientes.model";
import { Guiasenasag } from "./guiasenasag.model";
import { Tiposervicios } from "./tiposervicios.model";

export interface Serviciofaena {

    idserfae: number;
    fecser: Date;
    impser : number;
    numfae : number;
    estado: number;
    clientes : Clientes;
}

export interface Detserviciofaena {
    
    iddetser        : number;
    preser          : number;
    canser          : number;
    estado          : number;
    idserfae        : number;
    animales        : Animales;
    tiposervicios   : Tiposervicios;
    serviciofaena   : Serviciofaena;

}
export interface Detserviciofaenatemp {
 
    idtempser       : number;
    preser          : number;
    idserfae        : number;
    canser          : number;
    animales        : Animales;
    tiposervicios   : Tiposervicios;
    serviciofaena   :Serviciofaena;
    estado          : number;

}