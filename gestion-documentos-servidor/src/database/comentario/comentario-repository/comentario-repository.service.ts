import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comentario, ComentarioDocument } from '../schema/comentario.schema.js';
import { Model, Types } from 'mongoose';

@Injectable()
export class ComentarioRepositoryService {
  constructor(
    @InjectModel(Comentario.name)
    private readonly comentarioModel: Model<ComentarioDocument>,
  ) {}

  async obtenerPorDocumento(id: string) {
    return this.comentarioModel
      .find({
        documento_id: new Types.ObjectId(id),
      })
      .populate('usuario_id', 'correo');
  }
}
