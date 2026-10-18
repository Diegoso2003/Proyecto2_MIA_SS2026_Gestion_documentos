import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Rol } from '../Rol.js';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'usuario' })
export class Usuario {
  @Prop({ required: true })
  nombre: string;
  @Prop({ required: true, unique: true })
  correo: string;
  @Prop({ required: true, select: false })
  contraseña_hash: string;
  @Prop({ required: true })
  rol: Rol;
  @Prop({ default: true })
  activo: boolean;
}

export type UsuarioDocument = HydratedDocument<Usuario>;
export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
