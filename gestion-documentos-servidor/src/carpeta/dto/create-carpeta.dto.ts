import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateCarpetaDto {
  @IsString({ message: 'el nombre debe ser un string' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty({ message: 'el nombre no puede ser vacio' })
  @Matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s._-]+$/, {
    message:
      'El nombre de la carpeta contiene caracteres no válidos (solo letras, números, espacios, puntos, guiones y guiones bajos)',
  })
  nombre: string;
  @IsOptional()
  @IsString({ message: 'mandar una ruta valida' })
  @IsNotEmpty({ message: 'la carpeta padre no puede ser vacio' })
  padre: string;
}
