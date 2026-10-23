import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Documento, DocumentoDocument } from '../schema/documento.schema.js';
import { Model } from 'mongoose';
import { UsuarioDocument } from '../../usuario/schema/usuario.schema.js';

@Injectable()
export class DocumentoRepositoryService {
  constructor(
    @InjectModel(Documento.name)
    private readonly documentoModel: Model<DocumentoDocument>,
  ) {}

  async obtenerDocumentosRaiz(usuario: UsuarioDocument) {
    return this.documentoModel.find({
      propietario_id: usuario._id,
      carpeta_id: null,
      fecha_eliminacion: null,
    });
  }

  async obtenerDocumentosPorCarpeta(carpeta_id: string) {
    return this.documentoModel.find({
      carpeta_id,
      fecha_eliminacion: null,
    });
  }
}
