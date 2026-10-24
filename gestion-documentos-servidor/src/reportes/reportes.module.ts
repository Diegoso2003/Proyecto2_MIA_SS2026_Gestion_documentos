import { Module } from '@nestjs/common';
import { ReportesController } from './reportes.controller.js';
import { DatabaseModule } from '../database/database.module.js';
import { ArchivosPorTipoService } from './archivos-por-tipo/archivos-por-tipo.service.js';
import { PorRangoFechasService } from './por-rango-fechas/por-rango-fechas.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [ReportesController],
  providers: [ArchivosPorTipoService, PorRangoFechasService],
})
export class ReportesModule {}
