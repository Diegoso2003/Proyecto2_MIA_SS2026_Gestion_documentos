import { Module } from '@nestjs/common';
import { LoginService } from './login.service.js';
import { LoginController } from './login.controller.js';
import { EncriptadorModule } from '../seguridad/encriptador/encriptador.module.js';

@Module({
  controllers: [LoginController],
  providers: [LoginService],
  imports: [EncriptadorModule]
})
export class LoginModule {}
