import { PartialType } from '@nestjs/mapped-types';
import { CreateArchivoDto } from './create-archivo.dto.js';

export class UpdateArchivoDto extends PartialType(CreateArchivoDto) {}
