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
import type { UsuarioDocument } from '../database/usuario/schema/usuario.schema.js';

@Controller('carpeta')
export class CarpetaController {
  constructor(private readonly carpetaService: CarpetaService) {}

  @Post()
  create(@Body() createCarpetaDto: CreateCarpetaDto) {
    return this.carpetaService.create(createCarpetaDto);
  }

  @Get()
  async findAll(@GetUsuario() usuario: UsuarioDocument) {
    return await this.carpetaService.findAll(usuario);
  }

  @Get(':id')
  async findOne(
    @GetUsuario() usuario: UsuarioDocument,
    @Param('id') id: string,
  ) {
    return await this.carpetaService.findOne(usuario, id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCarpetaDto: UpdateCarpetaDto) {
    return this.carpetaService.update(+id, updateCarpetaDto);
  }

  @Delete('papelera/:id')
  async remove(
    @Param('id') id: string,
    @GetUsuario() usuario: UsuarioDocument,
  ) {
    return await this.carpetaService.remove(id, usuario);
  }
}
