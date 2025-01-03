import { Camara } from "./camara.model";
import { ProdCarnicos } from "./prodcarnicos.model";

export interface Entregaprodc{

    identpro     : number;
    fecent       : string; 
    dirent       : string;
    pesent       : number;
    estado       : number;
    camara       : Camara;
    prodcarnicos : ProdCarnicos;
    

}