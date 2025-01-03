import { Usuarios } from './usuarios.model';

export interface Personas {
    idper       : number;
    cedula      : number;
    nombre      : string;
    ap          : string;
    am          : string;
    genero      : string;
    telefono    : number;
    direccion   : string;
    email       : string;
    estado      : number;
    usuarios    : Usuarios;
    token ?     : string;
  
} 

