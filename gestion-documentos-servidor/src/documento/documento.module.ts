import { Module } from '@nestjs/common';
import { DocumentoService } from './documento.service.js';
import { DocumentoController } from './documento.controller.js';
import { DatabaseModule } from '../database/database.module.js';

@Module({
  imports: [DatabaseModule],
  controllers: [DocumentoController],
  providers: [DocumentoService],
})
export class DocumentoModule {}
