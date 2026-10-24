import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompartidoDto } from './dto/create-compartido.dto.js';
import { UpdateCompartidoDto } from './dto/update-compartido.dto.js';
import {
  CarpetaElementosRequest,
  DatosAncestro,
} from '../carpeta/dto/carpeta-elementos-request.dto.js';
import { UsuarioDocument } from '../database/usuario/schema/usuario.schema.js';
import { CarpetaRepositoryService } from '../database/carpeta/carpeta-repository/carpeta-repository.service.js';
import { CompartidoRepositoryService } from '../database/compartido/compartido-repository/compartido-repository.service.js';
import { DocumentoRepositoryService } from '../database/documento/documento-repository/documento-repository.service.js';

@Injectable()
export class CompartidoService {
  constructor(
    private readonly carpetaRepository: CarpetaRepositoryService,
    private readonly compartidoRepository: CompartidoRepositoryService,
    private readonly documentoRepository: DocumentoRepositoryService,
  ) {}
  create(createCompartidoDto: CreateCompartidoDto) {
    return 'This action adds a new compartido';
  }

  async findAll(usuario: UsuarioDocument): Promise<CarpetaElementosRequest> {
    return {
      nombre: '',
      carpetas:
        await this.compartidoRepository.carpetasCompartidasActivas(usuario),
      documentos: await this.compartidoRepository.archivosCompartidos(usuario),
      ancestros: [],
    };
  }

  async findOne(
    usuario: UsuarioDocument,
    carpetaId: string,
  ): Promise<CarpetaElementosRequest> {
    const carpeta = await this.carpetaRepository.obtenerCarpeta(carpetaId);
    if (!carpeta || carpeta.fecha_eliminacion !== null) {
      throw new NotFoundException('carpeta no encontrada');
    }
    let ancestrosVisibles: DatosAncestro[] = [];
    const permisos = await this.cortarAncestrosPorPermiso(
      carpeta.ancestros,
      usuario,
    );
    if (!permisos.existe) {
      const carpetaConPermiso = await this.compartidoRepository.existePermiso(
        usuario,
        carpeta._id,
      );
      if (!carpetaConPermiso) {
        throw new NotFoundException('no se encontro la carpeta');
      }
    } else {
      ancestrosVisibles = permisos.ancestros;
    }
    return {
      nombre: carpeta.nombre,
      ancestros: ancestrosVisibles,
      carpetas: await this.carpetaRepository.obtenerCarpetasHijas(carpetaId),
      documentos:
        await this.documentoRepository.obtenerDocumentosPorCarpeta(carpetaId),
    };
  }

  update(id: number, updateCompartidoDto: UpdateCompartidoDto) {
    return `This action updates a #${id} compartido`;
  }

  remove(id: number) {
    return `This action removes a #${id} compartido`;
  }

  private async cortarAncestrosPorPermiso(
    ancestros: DatosAncestro[],
    usuario: UsuarioDocument,
  ): Promise<{ ancestros: DatosAncestro[]; existe: boolean }> {
    if (ancestros.length === 0) return { ancestros: [], existe: false };

    for (let i = 0; i < ancestros.length; i++) {
      const id = ancestros[i]._id;
      if (!id) continue;
      if (await this.compartidoRepository.existePermiso(usuario, id)) {
        return { ancestros: ancestros.slice(i), existe: true };
      }
    }
    return { ancestros: [], existe: false };
  }
}
