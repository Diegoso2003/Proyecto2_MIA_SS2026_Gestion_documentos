import { IsIn, IsMongoId } from 'class-validator';
import { PERMISOS } from '../../reportes/constantes/reporte-constants.js';

export class ActualizarPermisoDto {
  @IsIn(['archivo', 'carpeta'], { message: 'El tipo debe ser archivo o carpeta' })
  recursoTipo: 'archivo' | 'carpeta';

  @IsMongoId({ message: 'El recurso no es válido' })
  recursoId: string;

  @IsMongoId({ message: 'El usuario destino no es válido' })
  usuarioDestinoId: string;

  @IsIn(PERMISOS, { message: 'El permiso debe ser lectura, edicion o comentar' })
  permiso: string;
}