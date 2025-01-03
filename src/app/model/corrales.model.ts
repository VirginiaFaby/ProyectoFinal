import { Tipoanimal } from "./tipoanimal.model";


export interface Corrales{
    idcorral  : number;
    nomcor    : string;
    capcor    : number;
    corani    : number;
    estado    : number;
    tipoanimal : Tipoanimal;
}