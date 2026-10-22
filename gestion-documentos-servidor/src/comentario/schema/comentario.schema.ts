import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Documento } from '../../documento/schema/documento.schema.js';
import { Usuario } from '../../usuario/schema/usuario.schema.js';

export type ComentarioDocument = HydratedDocument<Comentario>;

@Schema({ timestamps: true, collection: 'comentario' })
export class Comentario {
  @Prop({
    type: Types.ObjectId,
    ref: Documento.name,
    required: true,
  })
  documento_id: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Usuario.name,
    required: true,
  })
  usuario_id: Types.ObjectId;

  @Prop({
    required: true,
  })
  texto: string;
}

export const ComentarioSchema = SchemaFactory.createForClass(Comentario);
