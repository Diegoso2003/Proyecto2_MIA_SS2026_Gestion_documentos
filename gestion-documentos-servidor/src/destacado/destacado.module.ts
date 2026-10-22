import { Module } from '@nestjs/common';
import { DestacadoService } from './destacado.service.js';
import { DestacadoController } from './destacado.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DocumentoCompartido,
  DocumentoCompartidoSchema,
} from '../compartido/schema/compartido.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DocumentoCompartido.name, schema: DocumentoCompartidoSchema },
    ]),
  ],
  controllers: [DestacadoController],
  providers: [DestacadoService],
  exports: [MongooseModule],
})
export class DestacadoModule {}
