import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { EncriptadorModule } from './seguridad/encriptador/encriptador.module.js';
import { EncriptadorService } from './seguridad/encriptador/encriptador.service.js';
import { LoginModule } from './login/login.module.js';
import { UsuarioModule } from './usuario/usuario.module.js';

@Module({
  imports: [EncriptadorModule, LoginModule, UsuarioModule],
  controllers: [AppController],
  providers: [AppService, EncriptadorService],
})
export class AppModule {}
