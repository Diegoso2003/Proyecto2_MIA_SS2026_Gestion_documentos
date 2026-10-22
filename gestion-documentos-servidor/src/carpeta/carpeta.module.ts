import { Module } from '@nestjs/common';
import { CarpetaService } from './carpeta.service.js';
import { CarpetaController } from './carpeta.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Carpeta, CarpetaSchema } from './schema/carpeta.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Carpeta.name, schema: CarpetaSchema }]),
  ],
  controllers: [CarpetaController],
  providers: [CarpetaService],
  exports: [MongooseModule],
})
export class CarpetaModule {}
