import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Documento, DocumentoDocument } from '../schema/documento.schema.js';
import { Model, Types } from 'mongoose';
import { UsuarioDocument } from '../../usuario/schema/usuario.schema.js';
import { DatosAncestro } from '../../../carpeta/dto/carpeta-elementos-request.dto.js';

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
      carpeta_id: new Types.ObjectId(carpeta_id),
      fecha_eliminacion: null,
    });
  }

  async obtenerDocumentosPapelera(usuario: UsuarioDocument) {
    return this.documentoModel
      .find({
        propietario_id: usuario._id,
        fecha_eliminacion: { $ne: null },
        eliminado_individual: true,
      })
      .populate<{ ancestros: DatosAncestro[] }>('ancestros', 'nombre');
  }
}
