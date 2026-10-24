import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocumentoDto } from './dto/create-documento.dto.js';
import { UpdateDocumentoDto } from './dto/update-documento.dto.js';
import { UsuarioDocument } from '../database/usuario/schema/usuario.schema.js';
import { DocumentoRepositoryService } from '../database/documento/documento-repository/documento-repository.service.js';
import { CompartidoRepositoryService } from '../database/compartido/compartido-repository/compartido-repository.service.js';
import { DocumentoVistaModel } from './dto/documento-request.dto.js';
import { Permiso } from '../compartido/dto/permiso.js';
import { DocumentoDocument } from '../database/documento/schema/documento.schema.js';

@Injectable()
export class DocumentoService {
  constructor(
    private readonly documentoRepository: DocumentoRepositoryService,
    private readonly compartidoRepository: CompartidoRepositoryService,
  ) {}
  create(createDocumentoDto: CreateDocumentoDto) {
    return 'This action adds a new documento';
  }

  findAll(usuario: UsuarioDocument) {}

  async findOne(
    usuario: UsuarioDocument,
    id: string,
  ): Promise<DocumentoVistaModel> {
    const documento = await this.documentoRepository.obtenerPorId(id);
    if (!documento || documento.fecha_eliminacion !== null) {
      throw new NotFoundException(`no se encontro el archivo con id: ${id}`);
    }
    if (documento.propietario_id.toString() === usuario._id.toString()) {
      return this.castDocumentoVista(documento, Permiso.EDICION);
    }
    const permiso = await this.compartidoRepository.obtenerPermisoPorRecurso(
      documento._id,
      usuario,
    );
    if (permiso) {
      return this.castDocumentoVista(documento, permiso.permiso);
    }
    const ancestros = documento.ancestros;
    for (let i = ancestros.length - 1; i >= 0; i--) {
      const a = ancestros[i];
      const permiso_ancestro =
        await this.compartidoRepository.obtenerPermisoPorRecurso(a, usuario);
      if (permiso_ancestro) {
        return this.castDocumentoVista(documento, permiso_ancestro.permiso);
      }
    }
    throw new NotFoundException(`no se encontro el archivo con id: ${id}`);
  }
  private castDocumentoVista(
    documento: DocumentoDocument,
    permiso: Permiso,
  ): DocumentoVistaModel {
    return {
      _id: documento._id.toString(),
      nombre: documento.nombre,
      contenido: documento.contenido,
      extension: documento.extension as 'txt' | 'md',
      permiso,
    };
  }
  update(id: number, updateDocumentoDto: UpdateDocumentoDto) {
    return `This action updates a #${id} documento`;
  }

  remove(id: number) {
    return `This action removes a #${id} documento`;
  }
}
