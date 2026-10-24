import { Permiso } from "../dto/permiso.js";

export interface CompartidoFila {
  usuario_destino_id: string;
  nombre: string;
  correo: string;
  permiso: Permiso;
}

export interface ListaCompartidos {
  propietario_id: string;
  recurso_id: string;
  recurso_tipo: string;
  datos: CompartidoFila[];
}