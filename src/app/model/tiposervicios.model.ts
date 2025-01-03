import { Tipoanimal } from './tipoanimal.model';
export interface Tiposervicios{
    idtipser : number;
    nomser : string;
    preser :number;
    desser :string;
    estado : number;
    tipoanimal : Tipoanimal;
  
}