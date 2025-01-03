import { Tipoanimal } from "./tipoanimal.model";

export interface Tipoprodcarnico {
 
    idtipro      : number;       
    nompro       : string;        
    tipo         : string;          
    despro       : string;        
    estado       : number ;
    tipoanimal : Tipoanimal;
}