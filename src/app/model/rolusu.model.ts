import { Roles } from "./roles.model";
import { Usuarios } from "./usuarios.model";

export interface Rolusu{
    token: any;
    
    login : string;
    idrol : number;
    usuarios: Usuarios;
    roles : Roles;
}