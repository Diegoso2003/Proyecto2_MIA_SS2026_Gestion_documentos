import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service.js';
import { UsuarioController } from './usuario.controller.js';
import { EncriptadorModule } from '../seguridad/encriptador/encriptador.module.js';
import { DatabaseModule } from '../database/database.module.js';

@Module({
  imports: [EncriptadorModule, DatabaseModule],
  controllers: [UsuarioController],
  providers: [UsuarioService],
})
export class UsuarioModule {}
