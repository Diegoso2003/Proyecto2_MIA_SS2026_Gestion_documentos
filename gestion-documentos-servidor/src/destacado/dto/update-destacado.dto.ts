import { PartialType } from '@nestjs/mapped-types';
import { CreateDestacadoDto } from './create-destacado.dto.js';

export class UpdateDestacadoDto extends PartialType(CreateDestacadoDto) {}
