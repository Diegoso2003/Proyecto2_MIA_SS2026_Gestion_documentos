import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ACCIONES } from '../../../reportes/constantes/reporte-constants.js';

export type Accion = (typeof ACCIONES)[number];

export type HistorialDocument = HydratedDocument<Historial>;

@Schema({
  collection: 'historial',
  timestamps: { createdAt: true, updatedAt: false }, // un historial no se edita
  versionKey: false,
})
export class Historial {
  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
  usuario_id: Types.ObjectId;

  @Prop({ type: String, enum: ACCIONES, required: true })
  accion: Accion;

  @Prop({ type: String, required: true, trim: true })
  descripcion: string;

  createdAt: Date;
}

export const HistorialSchema = SchemaFactory.createForClass(Historial);
