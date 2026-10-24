import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DocumentoService } from './documento.service.js';
import { CreateDocumentoDto } from './dto/create-documento.dto.js';
import { UpdateDocumentoDto } from './dto/update-documento.dto.js';
import { GetUsuario } from '../decorators/get-usuario/get-usuario.decorator.js';
import type { UsuarioDocument } from '../database/usuario/schema/usuario.schema.js';
import { DocumentoVistaModel } from './dto/documento-request.dto.js';

@Controller('documento')
export class DocumentoController {
  constructor(private readonly documentoService: DocumentoService) {}

  @Post()
  create(@Body() createDocumentoDto: CreateDocumentoDto) {
    return this.documentoService.create(createDocumentoDto);
  }

  @Get()
  findAll(@GetUsuario() usuario: UsuarioDocument) {
    return this.documentoService.findAll(usuario);
  }

  @Get(':id')
  async findOne(
    @GetUsuario() usuario: UsuarioDocument,
    @Param('id') id: string,
  ): Promise<DocumentoVistaModel> {
    return await this.documentoService.findOne(usuario, id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDocumentoDto: UpdateDocumentoDto,
  ) {
    return this.documentoService.update(+id, updateDocumentoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentoService.remove(+id);
  }
}
