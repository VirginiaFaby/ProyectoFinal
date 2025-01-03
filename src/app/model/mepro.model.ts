import { Menus } from "./menus.model";
import { Procesos } from "./procesos.model";

export interface Mepro{
    
    idmen : number;
    idpro : number;
    proceso : Procesos;
    menu : Menus;
    meproId:any
}