import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../../decorators/public/public.decorator.js';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import {
  Usuario,
  UsuarioDocument,
} from '../../usuario/schema/usuario.schema.js';
import { Model } from 'mongoose';
import { ROLES_KEY } from '../../decorators/roles/roles.decorator.js';
import { Rol } from '../../usuario/Rol.js';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private reflector: Reflector,
    @InjectModel(Usuario.name)
    private readonly usuarioModel: Model<UsuarioDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('iniciar sesion');
    }
    let payload;
    try {
      payload = await this.jwtService.verifyAsync(token);
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('iniciar sesion');
    }
    const usuario = await this.usuarioModel.findById(payload.id);
    if (!usuario) throw new UnauthorizedException('Usuario no encontrado');
    if (!usuario.activo)
      throw new ForbiddenException(
        'Usuario suspendido, consultar con admin para reactivación',
      );

    const requiredRoles = this.reflector.getAllAndOverride<Rol[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (requiredRoles && !requiredRoles.includes(usuario.rol)) {
      throw new ForbiddenException('No tienes permisos');
    }

    request['usuario'] = usuario;
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
