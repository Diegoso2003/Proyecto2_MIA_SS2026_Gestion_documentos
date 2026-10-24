import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Usuario } from '../../usuario/schema/usuario.schema.js';

export type CarpetaDocument = HydratedDocument<Carpeta>;

@Schema({ timestamps: true, collection: 'carpeta' })
export class Carpeta {
  @Prop({
    required: true,
    trim: true,
  })
  nombre: string;

  @Prop({
    type: Types.ObjectId,
    ref: Usuario.name,
    required: true,
  })
  propietario_id: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Usuario.name,
    required: true,
  })
  modificado_por: Types.ObjectId;
  @Prop({
    type: Types.ObjectId,
    ref: Carpeta.name,
    default: null,
  })
  padre_id: Types.ObjectId | null;

  @Prop({
    type: [Types.ObjectId],
    ref: Carpeta.name,
    default: [],
  })
  ancestros: Types.ObjectId[];

  @Prop({
    type: Date,
    default: null,
  })
  fecha_eliminacion: Date | null;
  createdAt: Date;
}

export const CarpetaSchema = SchemaFactory.createForClass(Carpeta);
