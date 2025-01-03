
import { Clientes } from "./clientes.model";
import { Detcompras } from "./compras.model";
import { Personas } from "./personas.model";
import { Usuarios } from "./usuarios.model";

export interface Ventas {

	idven: number;
	fecven: string;
	impven: number;
	numven: number;
	canani: number;
	estado: number;
	clientes: Clientes;
	personas: Personas;

}
export interface Detventas {

	iddetven: number;
	canven: number;
	preven: number;
	idven: number;
	detcompras: Detcompras;
}
export interface Detventastemp {

	idtempven: number;
	canven: number;
	preven: number;
	idven: number;
	detcompras: Detcompras;
}
