import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CarpetaService } from './carpeta.service.js';
import { CreateCarpetaDto } from './dto/create-carpeta.dto.js';
import { UpdateCarpetaDto } from './dto/update-carpeta.dto.js';
import { GetUsuario } from '../decorators/get-usuario/get-usuario.decorator.js';
import { RutaCarpetaPadre } from './dto/ruta-carpeta-padre.dto.js';
import type { UsuarioDocument } from '../usuario/schema/usuario.schema.js';

@Controller('carpeta')
export class CarpetaController {
  constructor(private readonly carpetaService: CarpetaService) {}

  @Post()
  create(@Body() createCarpetaDto: CreateCarpetaDto) {
    return this.carpetaService.create(createCarpetaDto);
  }

  @Get('/carpetas-usuario')
  findAll(@GetUsuario() usuario: UsuarioDocument, padre: RutaCarpetaPadre) {
    return this.carpetaService.findAll(usuario, padre);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carpetaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCarpetaDto: UpdateCarpetaDto) {
    return this.carpetaService.update(+id, updateCarpetaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carpetaService.remove(+id);
  }
}
