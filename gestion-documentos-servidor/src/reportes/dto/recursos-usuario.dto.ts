import { IsIn, IsMongoId, IsOptional } from 'class-validator';
import { PERMISOS, RECURSOS_TIPO } from '../constantes/reporte-constants.js';

export class RecursosUsuarioDto {
  @IsMongoId({ message: 'El usuario seleccionado no es válido' })
  usuarioId: string;

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
}
