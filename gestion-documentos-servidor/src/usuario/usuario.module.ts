import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service.js';
import { UsuarioController } from './usuario.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuario, UsuarioSchema } from './schema/usuario.schema.js';
import { EncriptadorModule } from '../seguridad/encriptador/encriptador.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema }]),
    EncriptadorModule,
  ],
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports: [MongooseModule],
})
export class UsuarioModule {}
