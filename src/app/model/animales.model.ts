import { Corrales } from "./corrales.model";
import { Guiasenasag } from "./guiasenasag.model";
import { Razas } from "./razas.model";
import { Tipoanimal } from "./tipoanimal.model";

export interface Animales{
    idani       : number;
    feclleg     : Date; 
    edadani     : number;
    pesani      : number;
    origenani   : string;
    sexo        : string;
    canani      : number;
    tipocs      : string;
    estado      : number;
    guiasenasag : Guiasenasag;
    tipoanimal  : Tipoanimal;
    corrales    : Corrales;
    razas       : Razas; 
}

