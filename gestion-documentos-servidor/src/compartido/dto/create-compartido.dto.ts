import { IsEmail, IsIn, IsMongoId } from 'class-validator';
import { PERMISOS } from '../../reportes/constantes/reporte-constants.js';

export class CompartirRecursoDto {
  @IsIn(['archivo', 'carpeta'], { message: 'El tipo debe ser archivo o carpeta' })
  recursoTipo: 'archivo' | 'carpeta';

  @IsMongoId({ message: 'El recurso no es válido' })
  recursoId: string;

  @IsEmail({}, { message: 'El correo no es válido' })
  correo: string;

  @IsIn(PERMISOS, { message: 'El permiso debe ser lectura, edicion o comentar' })
  permiso: string;
}