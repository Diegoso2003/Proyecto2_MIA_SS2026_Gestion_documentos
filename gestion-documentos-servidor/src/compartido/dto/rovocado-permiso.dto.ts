import { IsIn, IsMongoId } from 'class-validator';

export class RevocarPermisoDto {
  @IsIn(['archivo', 'carpeta'], { message: 'El tipo debe ser archivo o carpeta' })
  recursoTipo: 'archivo' | 'carpeta';

  @IsMongoId({ message: 'El recurso no es válido' })
  recursoId: string;

  @IsMongoId({ message: 'El usuario destino no es válido' })
  usuarioDestinoId: string;
}