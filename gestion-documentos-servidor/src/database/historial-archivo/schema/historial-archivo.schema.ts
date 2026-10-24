import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ACCIONES_ARCHIVO } from '../../../reportes/constantes/reporte-constants.js';
import { Documento } from '../../documento/schema/documento.schema.js';
import { Usuario } from '../../usuario/schema/usuario.schema.js';

export type AccionArchivo = (typeof ACCIONES_ARCHIVO)[number];

export type HistorialArchivoDocument = HydratedDocument<HistorialArchivo>;

@Schema({
  collection: 'historial_archivo',
  timestamps: { createdAt: true, updatedAt: false },
  versionKey: false,
})
export class HistorialArchivo {
  @Prop({ type: Types.ObjectId, ref: Documento.name, required: true })
  documento_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Usuario.name, required: true })
  usuario_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Usuario.name, required: true })
  propietario_id: Types.ObjectId;

  @Prop({ type: String, enum: ACCIONES_ARCHIVO, required: true })
  accion: AccionArchivo;

  @Prop({ type: String, required: true, trim: true })
  descripcion: string;

  createdAt: Date;
}

export const HistorialArchivoSchema =
  SchemaFactory.createForClass(HistorialArchivo);
