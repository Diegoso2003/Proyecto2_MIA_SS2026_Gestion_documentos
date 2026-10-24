import { Module } from '@nestjs/common';
import { PapeleraService } from './papelera.service.js';
import { PapeleraController } from './papelera.controller.js';
import { DatabaseModule } from '../database/database.module.js';
import { EliminarDefinitivoService } from './eliminar-definitivo/eliminar-definitivo.service.js';

@Module({
  imports: [DatabaseModule],
  providers: [PapeleraService, EliminarDefinitivoService],
  controllers: [PapeleraController],
})
export class PapeleraModule {}
