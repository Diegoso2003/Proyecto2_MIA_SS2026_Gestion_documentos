import { Permiso } from '../../compartido/dto/permiso.js';

export interface DocumentoVistaModel {
  _id: string;
  nombre: string;
  contenido: string;
  extension: string;
  permiso: Permiso;
}
