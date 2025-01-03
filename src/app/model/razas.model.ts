import { Tipoanimal } from "./tipoanimal.model";


export interface Razas{
    idraz       : number;
    nomraz      : string;
    carraz      : string;
    pesprom     : string; 
    pesproh     : string;
    prerefm     : number;
    prerefh     : number;
    fotom       : string;
    fotoh       : string;
    estado      : number;
    tipoanimal  : Tipoanimal; 
}


