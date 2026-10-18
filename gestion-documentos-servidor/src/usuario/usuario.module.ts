import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service.js';
import { UsuarioController } from './usuario.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuario, UsuarioSchema } from './schema/usuario.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema }]),
  ],
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports: [MongooseModule],
})
export class UsuarioModule {}
