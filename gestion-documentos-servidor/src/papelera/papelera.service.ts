import { Injectable } from '@nestjs/common';
import { CarpetaRepositoryService } from '../database/carpeta/carpeta-repository/carpeta-repository.service.js';
import { DocumentoRepositoryService } from '../database/documento/documento-repository/documento-repository.service.js';
import { UsuarioDocument } from '../database/usuario/schema/usuario.schema.js';

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
}
