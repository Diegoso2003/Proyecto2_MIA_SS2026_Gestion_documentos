import { Module } from '@nestjs/common';
import { CompartidoService } from './compartido.service.js';
import { CompartidoController } from './compartido.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DocumentoCompartido,
  DocumentoCompartidoSchema,
} from './schema/compartido.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DocumentoCompartido.name, schema: DocumentoCompartidoSchema },
    ]),
  ],
  controllers: [CompartidoController],
  providers: [CompartidoService],
  exports: [MongooseModule],
})
export class CompartidoModule {}
