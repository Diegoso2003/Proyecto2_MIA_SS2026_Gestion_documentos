import { Module } from '@nestjs/common';
import { CarpetaService } from './carpeta.service.js';
import { CarpetaController } from './carpeta.controller.js';

@Module({
  controllers: [CarpetaController],
  providers: [CarpetaService],
})
export class CarpetaModule {}
