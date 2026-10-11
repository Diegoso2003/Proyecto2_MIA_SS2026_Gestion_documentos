import { Injectable } from '@nestjs/common';
import { EncriptadorService } from '../seguridad/encriptador/encriptador.service.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class LoginService {
    constructor(
        private readonly encriptadorService: EncriptadorService
    ) {}

    async iniciarSesion(login: LoginDto) {
        //validar que existe con el email
        return this.encriptadorService.hashConstraseña(login.contraseña);
    }
}
