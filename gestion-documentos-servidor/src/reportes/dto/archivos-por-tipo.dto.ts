import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsMongoId,
  IsOptional,
} from 'class-validator';

export class ArchivosPorTipoDto {
  @IsOptional()
  @IsMongoId({ message: 'envie un id valido' })
  propietarioId?: string;

  @IsOptional()
  @IsDateString({}, { message: 'envie una fecha desde valida' })
  desde?: string;

  @IsOptional()
  @IsDateString({}, { message: 'envie una fecha hasta valida' })
  hasta?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'envie un valor booleano valido' })
  incluirEliminados?: boolean;
}
