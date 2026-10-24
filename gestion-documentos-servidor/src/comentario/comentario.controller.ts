import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ComentarioService } from './comentario.service.js';
import { CreateComentarioDto } from './dto/create-comentario.dto.js';
import { UpdateComentarioDto } from './dto/update-comentario.dto.js';
import { GetUsuario } from '../decorators/get-usuario/get-usuario.decorator.js';
import type { UsuarioDocument } from '../database/usuario/schema/usuario.schema.js';

@Controller('comentario')
export class ComentarioController {
  constructor(private readonly comentarioService: ComentarioService) {}

  @Post()
  create(@Body() createComentarioDto: CreateComentarioDto) {
    return this.comentarioService.create(createComentarioDto);
  }

  @Get('documento/:id')
  findAll(@Param('id') id: string, @GetUsuario() usuario: UsuarioDocument) {
    return this.comentarioService.findAll(usuario, id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.comentarioService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateComentarioDto: UpdateComentarioDto,
  ) {
    return this.comentarioService.update(+id, updateComentarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.comentarioService.remove(+id);
  }
}
