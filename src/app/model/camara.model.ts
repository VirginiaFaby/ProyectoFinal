import { Tipoanimal } from "./tipoanimal.model";

export interface Camara {
    idcamfri : number;
    nomcam    : string;
    capcam    : number;
    temcam    : number;
    unitem    : string;
    canting : number;
    saldo   : number;
    estado    : number;
    tipoanimal : Tipoanimal;
}