import { Injectable } from '@nestjs/common';
import { CreateDocumentoDto } from './dto/create-documento.dto.js';
import { UpdateDocumentoDto } from './dto/update-documento.dto.js';
import { UsuarioDocument } from '../database/usuario/schema/usuario.schema.js';

@Injectable()
export class DocumentoService {
  constructor() {}
  create(createDocumentoDto: CreateDocumentoDto) {
    return 'This action adds a new documento';
  }

  findAll(usuario: UsuarioDocument) {}

  findOne(id: number) {
    return `This action returns a #${id} documento`;
  }

  update(id: number, updateDocumentoDto: UpdateDocumentoDto) {
    return `This action updates a #${id} documento`;
  }

  remove(id: number) {
    return `This action removes a #${id} documento`;
  }
}
