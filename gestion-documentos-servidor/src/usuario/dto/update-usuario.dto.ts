import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { Rol } from '../Rol.js';

export class UpdateUsuarioDto {
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  nombre: string;

  @IsEnum(Rol, { message: 'El rol no es válido' })
  rol: Rol;

  @IsEmail({}, { message: 'El correo no tiene un formato válido' })
  correo: string;
}
