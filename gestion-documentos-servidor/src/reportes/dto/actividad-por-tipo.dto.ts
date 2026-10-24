import { IsDateString, IsMongoId, IsOptional } from 'class-validator';

export class ActividadPorTipoDto {
  @IsOptional()
  @IsDateString({}, { message: 'La fecha "desde" no es válida' })
  desde?: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha "hasta" no es válida' })
  hasta?: string;

  @IsOptional()
  @IsMongoId({ message: 'El usuario seleccionado no es válido' })
  usuarioId?: string;
}
