import { Module } from '@nestjs/common';
import { DocumentoService } from './documento.service.js';
import { DocumentoController } from './documento.controller.js';

@Module({
  controllers: [DocumentoController],
  providers: [DocumentoService],
})
export class DocumentoModule {}
