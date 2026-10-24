export interface CompartidoFila {
  usuario_destino_id: string;
  nombre: string;
  correo: string;
  permiso: string;
}

export interface ListaCompartidos {
  propietario_id: string;
  recurso_id: string;
  recurso_tipo: string;
  datos: CompartidoFila[];
}
