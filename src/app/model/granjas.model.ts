import { Departamentos, Municipios, Provincias } from "./guiasenasag.model";
import { Tipoanimal } from "./tipoanimal.model";

export interface Granjas{
    idgranja        : number;
    codigo          : number;
    nomgra          : string;
    progra          : string;
    telegra         : number;
    correogra       : string;
    estado          : number;
    departamentos   : Departamentos;
    provincias      : Provincias;
    municipios      : Municipios;
    tipoanimal      : Tipoanimal; 
}