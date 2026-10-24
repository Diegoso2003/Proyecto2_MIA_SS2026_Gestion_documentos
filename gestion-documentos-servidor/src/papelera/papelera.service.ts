import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CarpetaRepositoryService } from '../database/carpeta/carpeta-repository/carpeta-repository.service.js';
import { DocumentoRepositoryService } from '../database/documento/documento-repository/documento-repository.service.js';
import { UsuarioDocument } from '../database/usuario/schema/usuario.schema.js';
import { CarpetaDocument } from '../database/carpeta/schema/carpeta.schema.js';
import { Types } from 'mongoose';
import { DocumentoDocument } from '../database/documento/schema/documento.schema.js';

@Injectable()
export class PapeleraService {
  constructor(
    private readonly carpetaRepository: CarpetaRepositoryService,
    private readonly documentoRepository: DocumentoRepositoryService,
  ) {}

  async obtenerPapeleraUsuario(usuario: UsuarioDocument) {
    return {
      carpetas: await this.carpetaRepository.obtenerCarpetasEnPapelera(usuario),
      documentos:
        await this.documentoRepository.obtenerDocumentosPapelera(usuario),
    };
  }

  async restaurarCarpeta(usuario: UsuarioDocument, id: string) {
    const carpeta = await this.carpetaRepository.obtenerPorId(id);

    if (
      !carpeta ||
      carpeta.propietario_id.toString() !== usuario._id.toString()
    ) {
      throw new NotFoundException('no se encontró la carpeta');
    }

    if (!carpeta.fecha_eliminacion) {
      throw new BadRequestException('la carpeta no está en la papelera');
    }

    const carpetaObjectId = new Types.ObjectId(id);
    const nombreLibre = await this.generarNombreLibre(carpeta);
    await this.carpetaRepository.actualizar(carpetaObjectId, {
      nombre: nombreLibre,
      fecha_eliminacion: null,
      eliminado_individual: false,
    });
    await this.carpetaRepository.restaurarSubcarpetas(carpetaObjectId);
    await this.documentoRepository.restaurarArchivosEnCarpeta(carpetaObjectId);
  }

  private async generarNombreLibre(carpeta: CarpetaDocument): Promise<string> {
    const nombreOriginal = carpeta.nombre;
    const padreId = carpeta.padre_id;
    const usuarioId = carpeta.propietario_id;
    const libre = padreId
      ? await this.carpetaRepository.existeCarpetaConNombreEnPadre(
          padreId.toString(),
          nombreOriginal,
          usuarioId,
        )
      : await this.carpetaRepository.existeCarpetaRaizConNombre(
          nombreOriginal,
          usuarioId,
        );
    if (!libre) {
      return nombreOriginal;
    }
    let contador = 1;
    while (true) {
      const candidato = `${nombreOriginal}-restaurada-${contador}`;
      const existe = padreId
        ? await this.carpetaRepository.existeCarpetaConNombreEnPadre(
            padreId.toString(),
            candidato,
            usuarioId,
          )
        : await this.carpetaRepository.existeCarpetaRaizConNombre(
            candidato,
            usuarioId,
          );
      if (!existe) {
        return candidato;
      }
      contador++;
    }
  }

  async restaurarDocumento(usuario: UsuarioDocument, id: string) {
    const documento = await this.documentoRepository.obtenerPorId(id);
    if (
      !documento ||
      documento.propietario_id.toString() !== usuario._id.toString()
    ) {
      throw new NotFoundException('no se encontró el documento');
    }
    if (!documento.fecha_eliminacion) {
      throw new BadRequestException('el documento no está en la papelera');
    }
    const nombreLibre = await this.generarNombreLibreDocumento(documento);
    await this.documentoRepository.actualizar(documento._id, {
      nombre: nombreLibre,
      fecha_eliminacion: null,
      eliminado_individual: false,
    });
  }

  private async generarNombreLibreDocumento(
    documento: DocumentoDocument,
  ): Promise<string> {
    const nombreOriginal = documento.nombre;
    const carpetaId = documento.carpeta_id;
    const usuarioId = documento.propietario_id;
    const hayDuplicado = carpetaId
      ? await this.documentoRepository.existeDocumentoConNombreEnCarpeta(
          carpetaId.toString(),
          nombreOriginal,
          usuarioId,
        )
      : await this.documentoRepository.existeDocumentoRaizConNombre(
          nombreOriginal,
          usuarioId,
        );

    if (!hayDuplicado) {
      return nombreOriginal;
    }
    let contador = 1;
    while (true) {
      const candidato = `${nombreOriginal} (restaurado ${contador})`;
      const existe = carpetaId
        ? await this.documentoRepository.existeDocumentoConNombreEnCarpeta(
            carpetaId.toString(),
            candidato,
            usuarioId,
          )
        : await this.documentoRepository.existeDocumentoRaizConNombre(
            candidato,
            usuarioId,
          );
      if (!existe) {
        return candidato;
      }
      contador++;
    }
  }
}
