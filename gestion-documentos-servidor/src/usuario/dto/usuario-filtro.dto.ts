import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { Rol } from '../Rol.js';
import { Transform } from 'class-transformer';

export class UsuarioFiltroDto {
  @IsOptional()
  @IsEnum(Rol, { message: 'El rol no es válido' })
  rol?: Rol;

  @IsOptional()
  @Transform(({ value }) => (value === 'false' ? false : true))
  @IsBoolean({ message: 'El estado debe ser un booleano' })
  estado?: boolean;

  @IsOptional()
  @IsEmail({}, { message: 'El correo no tiene un formato válido' })
  correo?: string;

  @IsOptional()
  @IsString({ message: 'El nombre debe ser un string ' })
  @Transform(({ value }) => value.trim())
  nombre?: string;
}
