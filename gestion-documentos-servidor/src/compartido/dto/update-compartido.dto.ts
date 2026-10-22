import { PartialType } from '@nestjs/mapped-types';
import { CreateCompartidoDto } from './create-compartido.dto.js';

export class UpdateCompartidoDto extends PartialType(CreateCompartidoDto) {}
