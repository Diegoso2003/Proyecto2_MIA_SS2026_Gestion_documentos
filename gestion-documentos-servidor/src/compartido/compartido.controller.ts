import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CompartidoService } from './compartido.service.js';
import { CreateCompartidoDto } from './dto/create-compartido.dto.js';
import { UpdateCompartidoDto } from './dto/update-compartido.dto.js';
import { GetUsuario } from '../decorators/get-usuario/get-usuario.decorator.js';
import type { UsuarioDocument } from '../database/usuario/schema/usuario.schema.js';

@Controller('compartido')
export class CompartidoController {
  constructor(private readonly compartidoService: CompartidoService) {}

  @Post()
  create(@Body() createCompartidoDto: CreateCompartidoDto) {
    return this.compartidoService.create(createCompartidoDto);
  }

  @Get('carpeta')
  async findAll(@GetUsuario() usuario: UsuarioDocument) {
    return await this.compartidoService.findAll(usuario);
  }

  @Get('carpeta/:id')
  async findOne(
    @GetUsuario() usuario: UsuarioDocument,
    @Param('id') id: string,
  ) {
    return await this.compartidoService.findOne(usuario, id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCompartidoDto: UpdateCompartidoDto,
  ) {
    return this.compartidoService.update(+id, updateCompartidoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.compartidoService.remove(+id);
  }
}
