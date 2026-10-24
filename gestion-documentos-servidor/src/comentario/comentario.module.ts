import { Module } from '@nestjs/common';
import { ComentarioService } from './comentario.service.js';
import { ComentarioController } from './comentario.controller.js';
import { DatabaseModule } from '../database/database.module.js';
import { DocumentoModule } from '../documento/documento.module.js';

@Module({
  imports: [DatabaseModule, DocumentoModule],
  controllers: [ComentarioController],
  providers: [ComentarioService],
})
export class ComentarioModule {}
