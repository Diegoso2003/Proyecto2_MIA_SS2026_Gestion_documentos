import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Usuario } from '../../usuario/schema/usuario.schema.js';
import { Carpeta } from '../../carpeta/schema/carpeta.schema.js';

export type DocumentoDocument = HydratedDocument<Documento>;

@Schema({ timestamps: true, collection: 'documento' })
export class Documento {
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
  carpeta_id: Types.ObjectId | null;

  @Prop({
    required: true,
    enum: ['txt', 'md'],
  })
  extension: string;

  @Prop({
    required: true,
  })
  tipo_mime: string;

  @Prop({
    required: true,
  })
  tamano_bytes: number;

  @Prop({
    required: true,
    select: false,
  })
  contenido: string;

  @Prop({
    default: null,
    type: Date,
  })
  fecha_eliminacion: Date | null;

  @Prop({
    type: [Types.ObjectId],
    ref: Carpeta.name,
    default: [],
  })
  ancestros: Types.ObjectId[];
}

export const DocumentoSchema = SchemaFactory.createForClass(Documento);
