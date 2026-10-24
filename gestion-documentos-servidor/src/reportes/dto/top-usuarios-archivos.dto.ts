import { Transform } from 'class-transformer';
import { IsBoolean, IsDateString, IsIn, IsOptional } from 'class-validator';
import { EXTENSIONES } from '../constantes/reporte-constants.js';

export class TopUsuariosArchivosDto {
  @IsOptional()
  @IsIn(EXTENSIONES, { message: 'La extensión debe ser txt o md' })
  extension?: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha "desde" no es válida' })
  desde?: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha "hasta" no es válida' })
  hasta?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'incluirEliminados debe ser true o false' })
  incluirEliminados?: boolean;
}
