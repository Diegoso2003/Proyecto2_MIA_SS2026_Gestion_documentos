import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  DocumentoCompartido,
  DocumentoCompartidoDocument,
} from '../schema/compartido.schema.js';
import { Model, Types } from 'mongoose';
import { UsuarioDocument } from '../../usuario/schema/usuario.schema.js';
import { CarpetaDocument } from '../../carpeta/schema/carpeta.schema.js';
import { DocumentoDocument } from '../../documento/schema/documento.schema.js';

@Injectable()
export class CompartidoRepositoryService {
  constructor(
    @InjectModel(DocumentoCompartido.name)
    private readonly documentoCompartidoModel: Model<DocumentoCompartidoDocument>,
  ) {}

  async carpetasCompartidasActivas(usuario: UsuarioDocument) {
    return this.documentoCompartidoModel.aggregate<CarpetaDocument>([
      {
        $match: {
          usuario_destino_id: usuario._id,
          recurso_tipo: 'carpeta',
        },
      },
      {
        $lookup: {
          from: 'carpeta',
          localField: 'recurso_id',
          foreignField: '_id',
          as: 'carpeta',
        },
      },
      { $unwind: '$carpeta' },
      { $match: { 'carpeta.fecha_eliminacion': { $type: 'null' } } },
      { $replaceRoot: { newRoot: '$carpeta' } },
    ]);
  }

  async archivosCompartidos(usuario: UsuarioDocument) {
    return this.documentoCompartidoModel.aggregate<DocumentoDocument>([
      {
        $match: {
          usuario_destino_id: usuario._id,
          recurso_tipo: 'documento',
        },
      },
      {
        $lookup: {
          from: 'documento',
          localField: 'recurso_id',
          foreignField: '_id',
          as: 'documento',
        },
      },
      { $unwind: '$documento' },
      { $match: { 'documento.fecha_eliminacion': { $type: 'null' } } },
      { $replaceRoot: { newRoot: '$documento' } },
    ]);
  }

  async obtenerPermiso(ancestros: Types.ObjectId[], usuario: UsuarioDocument) {
    const recursoCompartido = await this.documentoCompartidoModel.findOne({
      recurso_id: { $in: ancestros },
      usuario_destino_id: usuario._id,
    });
    return recursoCompartido;
  }

  async existePermiso(
    usuario: UsuarioDocument,
    carpetaId: string | Types.ObjectId,
  ) {
    const recursoCompartido = await this.documentoCompartidoModel.findOne({
      recurso_id: carpetaId,
      usuario_destino_id: usuario._id,
    });
    return !!recursoCompartido;
  }
}
