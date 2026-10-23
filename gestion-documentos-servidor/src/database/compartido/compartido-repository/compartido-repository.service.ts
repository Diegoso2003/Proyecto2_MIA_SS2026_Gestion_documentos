import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  DocumentoCompartido,
  DocumentoCompartidoDocument,
} from '../schema/compartido.schema.js';
import { Model, Types } from 'mongoose';
import { UsuarioDocument } from '../../usuario/schema/usuario.schema.js';

@Injectable()
export class CompartidoRepositoryService {
  constructor(
    @InjectModel(DocumentoCompartido.name)
    private readonly documentoCompartidoModel: Model<DocumentoCompartidoDocument>,
  ) {}

  async verificarPermisos(
    ancestros: Types.ObjectId[],
    usuario: UsuarioDocument,
  ): Promise<boolean> {
    const recursoCompartido = await this.documentoCompartidoModel.findOne({
      recurso_id: { $in: ancestros },
      usuario_destino_id: usuario._id,
    });
    return !!recursoCompartido;
  }
}
