import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Carpeta, CarpetaSchema } from './carpeta/schema/carpeta.schema.js';
import { UsuarioRepositoryService } from './usuario/usuario-repository/usuario-repository.service.js';
import { Usuario, UsuarioSchema } from './usuario/schema/usuario.schema.js';
import {
  Comentario,
  ComentarioSchema,
} from './comentario/schema/comentario.schema.js';
import {
  Documento,
  DocumentoSchema,
} from './documento/schema/documento.schema.js';
import { CarpetaRepositoryService } from './carpeta/carpeta-repository/carpeta-repository.service.js';
import {
  Destacado,
  DestacadoSchema,
} from './destacado/schema/destacado.schema.js';
import {
  DocumentoCompartido,
  DocumentoCompartidoSchema,
} from './compartido/schema/compartido.schema.js';
import { CompartidoRepositoryService } from './compartido/compartido-repository/compartido-repository.service.js';
import { DocumentoRepositoryService } from './documento/documento-repository/documento-repository.service.js';
import { ComentarioRepositoryService } from './comentario/comentario-repository/comentario-repository.service.js';
import {
  HistorialArchivo,
  HistorialArchivoSchema,
} from './historial-archivo/schema/historial-archivo.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Carpeta.name, schema: CarpetaSchema },
      {
        name: Usuario.name,
        schema: UsuarioSchema,
      },
      { name: Comentario.name, schema: ComentarioSchema },
      { name: Documento.name, schema: DocumentoSchema },
      { name: Destacado.name, schema: DestacadoSchema },
      { name: DocumentoCompartido.name, schema: DocumentoCompartidoSchema },
      { name: HistorialArchivo.name, schema: HistorialArchivoSchema },
    ]),
  ],
  providers: [
    CarpetaRepositoryService,
    CompartidoRepositoryService,
    DocumentoRepositoryService,
    UsuarioRepositoryService,
    ComentarioRepositoryService,
  ],
  exports: [
    CarpetaRepositoryService,
    CompartidoRepositoryService,
    DocumentoRepositoryService,
    UsuarioRepositoryService,
    ComentarioRepositoryService,
    MongooseModule,
  ],
})
export class DatabaseModule {}
