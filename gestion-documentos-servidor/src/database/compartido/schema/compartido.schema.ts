import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Usuario } from '../../usuario/schema/usuario.schema.js';

export type DocumentoCompartidoDocument = HydratedDocument<DocumentoCompartido>;

@Schema({ timestamps: true, collection: 'documento_compartido' })
export class DocumentoCompartido {
  @Prop({
    required: true,
    enum: ['archivo', 'carpeta'],
  })
  recurso_tipo: string;

  @Prop({
    type: Types.ObjectId,
    required: true,
    refPath: 'recurso_tipo',
  })
  recurso_id: Types.ObjectId;

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
  usuario_destino_id: Types.ObjectId;

  @Prop({
    required: true,
    enum: ['lectura', 'edicion', 'comentar'],
  })
  permiso: string;
}

export const DocumentoCompartidoSchema =
  SchemaFactory.createForClass(DocumentoCompartido);
