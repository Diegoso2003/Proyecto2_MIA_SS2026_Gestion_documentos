import { IsDateString, IsIn, IsMongoId, IsOptional } from 'class-validator';
import { PERIODOS } from '../constantes/reporte-constants.js';

export class ActividadPorPeriodoDto {
  @IsOptional()
  @IsIn(PERIODOS, { message: 'El período debe ser dia, semana o mes' })
  periodo?: 'dia' | 'semana' | 'mes';

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
