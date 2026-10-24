export type Permiso = 'lector' | 'comentar' | 'edicion';

export interface DocumentoVistaModel {
  _id: string;
  nombre: string;
  contenido: string;
  extension: 'txt' | 'md';
  permiso: Permiso;
}

export interface ComentarioVistaModel {
  _id: string;
  texto: string;
  documento_id: string;
  usuario_id: { _id: string; correo: string };
  createdAt: string;
  updatedAt: string;
}
