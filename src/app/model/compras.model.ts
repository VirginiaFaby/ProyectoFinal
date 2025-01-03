
import { Animales } from "./animales.model";
import { Granjas } from "./granjas.model";

export interface Compras{
    idcom      : number;
    feccom       : string;
    impcom      : number;
    numcom      : number;
    cancani      : number;
    comven      : number;
    parven      : number;
    estado      : number;
    granjas     : Granjas;

}
export interface Detcompras{

    iddetcom      : number;
    cancom      : number;
    precom      : number;
    preven      : number;
    prekil      :number;
    idcom      : number;
    animales    : Animales;
}
export interface Detcomtemp{
    
    idtempcom   : number;
    cancom      : number;
    precom      : number;
    preven      : number;
    prekil      :number;
    idcom      : number;
    animales    : Animales;
    
}