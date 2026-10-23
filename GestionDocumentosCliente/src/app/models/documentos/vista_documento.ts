export interface Ancestro {
  _id?: string;
  nombre: string;
}

export interface Detalles {
  nombre: string;
  tamano_bytes?: number;
  propietario_id: { correo: string };
  updatedAt: string;
  modificado_por: { correo: string };
  extension: string;
}

export interface Carpeta {
  _id: string;
  nombre: string;
  propietario_id: string;
  padre_id: string | null;
  ancestros: Ancestro[];
  updatedAt: string;
  createdAt: string;
  fecha_eliminacion: string | null;
}

export interface Documento {
  _id: string;
  nombre: string;
  propietario_id: string;
  carpeta_id: string | null;
  fecha_eliminacion: string | null;
  ancestros: Ancestro[];
  updatedAt: string;
  createdAt: string;
  tamano_bytes: number;
  mime_type: string;
}

export interface ContenidoCarpeta {
  nombre: string;
  carpetas: Carpeta[];
  documentos: Documento[];
  ancestros: Ancestro[];
}
