import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateUsuarioPassword {
  @IsString()
  @IsNotEmpty({ message: 'La contraseña no puede estar vacia' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  contraseña: string;
}
