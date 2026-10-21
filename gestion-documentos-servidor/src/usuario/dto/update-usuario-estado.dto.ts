import { IsBoolean } from 'class-validator';

export class UpdateUsuarioEstadoDTO {
  @IsBoolean({ message: 'El estado debe ser un valor booleano' })
  estado: boolean;
}
