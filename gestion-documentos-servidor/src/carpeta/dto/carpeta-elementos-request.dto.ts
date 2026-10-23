import { CarpetaDocument } from '../../database/carpeta/schema/carpeta.schema.js';
import { DocumentoDocument } from '../../database/documento/schema/documento.schema.js';

export interface CarpetaElementosRequest {
  carpetas: CarpetaDocument[];
  documentos: DocumentoDocument[];
  nombre: string;
  ancestros: DatosAncestro[];
}

export interface DatosAncestro {
  _id: string;
  nombre: string;
}
