import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { Rol } from '../Rol.js';

export class CreateUsuarioDto {
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'la contraseña no puede estar vacia' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  contraseña: string;

  @IsEnum(Rol, { message: 'El rol no es válido' })
  rol: Rol;

  @IsEmail({}, { message: 'El correo no tiene un formato válido' })
  correo: string;
}
