import { Module } from '@nestjs/common';
import { DocumentoService } from './documento.service.js';
import { DocumentoController } from './documento.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Documento, DocumentoSchema } from './schema/documento.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Documento.name, schema: DocumentoSchema },
    ]),
  ],
  controllers: [DocumentoController],
  providers: [DocumentoService],
  exports: [MongooseModule],
})
export class DocumentoModule {}
