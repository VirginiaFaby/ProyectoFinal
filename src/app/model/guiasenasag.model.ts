
import { Granjas } from './granjas.model';
import { Personas } from './personas.model';
import { Tiposervicios } from './tiposervicios.model';

export interface Guiasenasag{

    idguisen: number;
    feclle: string;
    nroguia: number;
    tothem: number;
    totmac: number;
    totani: number;
    preguia: number;
    ingguia: number;    
    observaciones: string;
    guiani       : number;
    estado: number;
    granjas : Granjas;
    tiposervicios: Tiposervicios;
    departamentos: Departamentos;
    oficinalocal    : Oficinalocal; 

}

export interface Departamentos{
    iddep           : number;
    nomdep          : string;
}

export interface Provincias{
    idprovin        : number;
    nomprovin       : string;
    departamentos   : Departamentos;
}

export interface Municipios{
    idmun           : number;
    nommun          : string;
    provincias      : Provincias;
}

export interface Oficinalocal{
    idofi           : number;
    nomofi          : string;
    departamentos   : Departamentos;
}

