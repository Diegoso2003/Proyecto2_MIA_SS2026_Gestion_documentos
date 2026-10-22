import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Usuario } from '../../usuario/schema/usuario.schema.js';

export type DestacadoDocument = HydratedDocument<Destacado>;

@Schema({ timestamps: true, collection: 'documento_destacado' })
export class Destacado {
  @Prop({
    type: Types.ObjectId,
    ref: Usuario.name,
    required: true,
  })
  usuario_id: Types.ObjectId;

  @Prop({
    required: true,
    enum: ['archivo', 'carpeta'],
  })
  recurso_tipo: string;

  @Prop({
    type: Types.ObjectId,
    required: true,
  })
  recurso_id: Types.ObjectId;
}

export const DestacadoSchema = SchemaFactory.createForClass(Destacado);
