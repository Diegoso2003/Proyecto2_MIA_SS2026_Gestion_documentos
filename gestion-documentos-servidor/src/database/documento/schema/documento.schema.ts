import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Usuario } from '../../usuario/schema/usuario.schema.js';
import { Carpeta } from '../../carpeta/schema/carpeta.schema.js';

export type DocumentoDocument = HydratedDocument<Documento>;

@Schema({ _id: false })
export class DetallesDocumento {
  @Prop({
    required: true,
    enum: ['txt', 'md'],
  })
  extension: string;

  @Prop({
    required: true,
  })
  tipo_mime: string;
}

export const DetallesDocumentoSchema =
  SchemaFactory.createForClass(DetallesDocumento);

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
    type: DetallesDocumentoSchema,
    required: true,
  })
  detalles: DetallesDocumento;

  @Prop({
    required: true,
  })
  contenido: string;

  @Prop({
    default: null,
    type: Date,
  })
  fecha_eliminacion: Date | null;

  @Prop({ type: [Types.ObjectId], ref: Carpeta.name, default: [] })
  ancestros: Types.ObjectId[];
}

export const DocumentoSchema = SchemaFactory.createForClass(Documento);
