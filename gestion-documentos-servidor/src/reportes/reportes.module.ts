import { Module } from '@nestjs/common';
import { ReportesController } from './reportes.controller.js';
import { DatabaseModule } from '../database/database.module.js';
import { ArchivosPorTipoService } from './archivos-por-tipo/archivos-por-tipo.service.js';
import { PorRangoFechasService } from './por-rango-fechas/por-rango-fechas.service.js';
import { ReporteMasOperacionesService } from './reporte-mas-operaciones/reporte-mas-operaciones.service.js';
import { TopUsuariosArchivosService } from './top-usuarios-archivos/top-usuarios-archivos.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [ReportesController],
  providers: [ArchivosPorTipoService, PorRangoFechasService, ReporteMasOperacionesService, TopUsuariosArchivosService],
})
export class ReportesModule {}
