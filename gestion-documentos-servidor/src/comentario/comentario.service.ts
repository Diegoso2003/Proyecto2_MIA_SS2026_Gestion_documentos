import { Injectable } from '@nestjs/common';
import { CreateComentarioDto } from './dto/create-comentario.dto.js';
import { UpdateComentarioDto } from './dto/update-comentario.dto.js';
import { UsuarioDocument } from '../database/usuario/schema/usuario.schema.js';
import { DocumentoService } from '../documento/documento.service.js';
import { ComentarioRepositoryService } from '../database/comentario/comentario-repository/comentario-repository.service.js';

@Injectable()
export class ComentarioService {
  constructor(
    private readonly comentarioRepository: ComentarioRepositoryService,
    private readonly documentoService: DocumentoService,
  ) {}

  create(createComentarioDto: CreateComentarioDto) {
    return 'This action adds a new comentario';
  }

  async findAll(usuario: UsuarioDocument, id: string) {
    const documento = await this.documentoService.findOne(usuario, id);
    return await this.comentarioRepository.obtenerPorDocumento(documento._id);
  }

  findOne(id: number) {
    return `This action returns a #${id} comentario`;
  }

  update(id: number, updateComentarioDto: UpdateComentarioDto) {
    return `This action updates a #${id} comentario`;
  }

  remove(id: number) {
    return `This action removes a #${id} comentario`;
  }
}
