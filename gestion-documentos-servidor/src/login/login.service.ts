import { BadRequestException, Injectable } from '@nestjs/common';
import { EncriptadorService } from '../seguridad/encriptador/encriptador.service.js';
import { LoginDto } from './dto/login.dto.js';
import { InjectModel } from '@nestjs/mongoose';
import { Usuario, UsuarioDocument } from '../usuario/schema/usuario.schema.js';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginService {
  constructor(
    private readonly encriptadorService: EncriptadorService,
    private readonly jwtService: JwtService,
    @InjectModel(Usuario.name)
    private readonly usuarioModel: Model<UsuarioDocument>,
  ) {}

  async iniciarSesion(login: LoginDto) {
    const usuario: UsuarioDocument | null = await this.usuarioModel
      .findOne({ correo: login.correo })
      .select('+contraseña_hash');
    if (!usuario) {
      throw new BadRequestException('correo o contraseña incorrectos');
    }
    const valido: boolean = await this.encriptadorService.verificarContraseña(
      login.contraseña,
      usuario.contraseña_hash,
    );
    if (!valido) {
      throw new BadRequestException('correo o contraseña incorrectos');
    }
    if (!usuario.activo) {
      throw new BadRequestException(
        'usuario suspendido consulte con un administrador para solucionar el problema',
      );
    }
    return this.login(usuario);
  }

  login(usuario: UsuarioDocument): { token: string } {
    const payload = {
      rol: usuario.rol,
      id: usuario._id,
    };
    const token: string = this.jwtService.sign(payload);
    return { token: token };
  }
}
