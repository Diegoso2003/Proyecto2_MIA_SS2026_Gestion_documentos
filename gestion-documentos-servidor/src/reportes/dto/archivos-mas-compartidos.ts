import { IsDateString, IsIn, IsOptional } from 'class-validator';
import { PERMISOS, RECURSOS_TIPO } from '../constantes/reporte-constants.js';

export class UsuariosMasCompartidosDto {
  @IsOptional()
  @IsIn(RECURSOS_TIPO, {
    message: 'El tipo de recurso debe ser archivo o carpeta',
  })
  recursoTipo?: string;

  @IsOptional()
  @IsIn(PERMISOS, {
    message: 'El permiso debe ser lectura, edicion o comentar',
  })
  permiso?: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha "desde" no es válida' })
  desde?: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha "hasta" no es válida' })
  hasta?: string;
}
