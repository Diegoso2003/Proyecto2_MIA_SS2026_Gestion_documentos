import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCarpetaDto } from './dto/create-carpeta.dto.js';
import { UpdateCarpetaDto } from './dto/update-carpeta.dto.js';
import { CarpetaRepositoryService } from '../database/carpeta/carpeta-repository/carpeta-repository.service.js';
import { UsuarioDocument } from '../database/usuario/schema/usuario.schema.js';
import { DocumentoRepositoryService } from '../database/documento/documento-repository/documento-repository.service.js';
import { CarpetaElementosRequest } from './dto/carpeta-elementos-request.dto.js';

@Injectable()
export class CarpetaService {
  constructor(
    private readonly carpetaRepasitory: CarpetaRepositoryService,
    private readonly documentoRepository: DocumentoRepositoryService,
  ) {}
  create(createCarpetaDto: CreateCarpetaDto) {
    return 'This action adds a new carpeta';
  }

  async findAll(usuario: UsuarioDocument): Promise<CarpetaElementosRequest> {
    return {
      carpetas: await this.carpetaRepasitory.obtenerCarpetasRaiz(usuario),
      documentos: await this.documentoRepository.obtenerDocumentosRaiz(usuario),
      nombre: 'mis-documentos',
      ancestros: [],
    };
  }

  async findOne(
    usuario: UsuarioDocument,
    carpetaId: string,
  ): Promise<CarpetaElementosRequest> {
    const carpeta = await this.carpetaRepasitory.obtenerCarpeta(carpetaId);
    if (!carpeta || carpeta.fecha_eliminacion !== null) {
      throw new NotFoundException('carpeta no encontrada');
    }
    if (carpeta.propietario_id.toString() === usuario._id.toString()) {
      return {
        carpetas: await this.carpetaRepasitory.obtenerCarpetasHijas(carpetaId),
        nombre: carpeta.nombre,
        ancestros: carpeta.ancestros,
        documentos:
          await this.documentoRepository.obtenerDocumentosPorCarpeta(carpetaId),
      };
    }

    throw new NotFoundException('carpeta no encontrada');
  }

  update(id: number, updateCarpetaDto: UpdateCarpetaDto) {
    return `This action updates a #${id} carpeta`;
  }

  async remove(id: string, usuario: UsuarioDocument) {
    const carpeta = await this.carpetaRepasitory.obtenerPorId(id);
    if (!carpeta) {
      throw new NotFoundException('no se encontro la carpeta');
    }
    if (carpeta.propietario_id.toString() !== usuario._id.toString()) {
      throw new NotFoundException('no se encrontro la carpeta');
    }

    carpeta.fecha_eliminacion = new Date();
    carpeta.eliminado_individual = true;
    carpeta.save();
    this.documentoRepository.borrarArchivosEnCarpeta(
      carpeta.fecha_eliminacion,
      carpeta._id,
    );
    this.carpetaRepasitory.borrarSubcarpetas(
      carpeta.fecha_eliminacion,
      carpeta._id,
    );
  }
}
