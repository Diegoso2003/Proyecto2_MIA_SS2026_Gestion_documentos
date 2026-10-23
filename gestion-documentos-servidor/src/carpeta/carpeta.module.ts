import { Module } from '@nestjs/common';
import { CarpetaService } from './carpeta.service.js';
import { CarpetaController } from './carpeta.controller.js';
import { DatabaseModule } from '../database/database.module.js';

@Module({
  imports: [DatabaseModule],
  controllers: [CarpetaController],
  providers: [CarpetaService],
})
export class CarpetaModule {}
