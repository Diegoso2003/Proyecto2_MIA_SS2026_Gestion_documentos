import { IsOptional, IsString } from 'class-validator';

export class RutaCarpetaPadre {
  @IsOptional()
  @IsString({ message: 'la ruta del padre debe ser un string' })
  rutaPadre: string;
}
