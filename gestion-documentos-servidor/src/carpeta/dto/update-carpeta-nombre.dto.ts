import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class UpdateCarpetaNombreDto {
  @IsString({ message: 'el nombre debe ser un string' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty({ message: 'el nombre no puede ser vacio' })
  @Matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s._-]+$/, {
    message:
      'El nombre de la carpeta contiene caracteres no válidos (solo letras, números, espacios, puntos, guiones y guiones bajos)',
  })
  nombre: string;
}
