import { Module } from '@nestjs/common';
import { ReportesController } from './reportes.controller.js';
import { DatabaseModule } from '../database/database.module.js';
import { ArchivosPorTipoService } from './archivos-por-tipo/archivos-por-tipo.service.js';
import { PorRangoFechasService } from './por-rango-fechas/por-rango-fechas.service.js';
import { ReporteMasOperacionesService } from './reporte-mas-operaciones/reporte-mas-operaciones.service.js';
import { TopUsuariosArchivosService } from './top-usuarios-archivos/top-usuarios-archivos.service.js';
import { UsuariosMasCompartidosService } from './usuarios-mas-compartidos/usuarios-mas-compartidos.service.js';
import { ArchivosMasCompartidosService } from './archivos-mas-compartidos/archivos-mas-compartidos.service.js';
import { ComparticionUsuarioService } from './comparticion-usuario/comparticion-usuario.service.js';
import { HistorialUsuarioService } from './historial-usuario/historial-usuario.service.js';
import { ActividadPorTipoService } from './actividad-por-tipo/actividad-por-tipo.service.js';
import { ActividadPorPeriodoService } from './actividad-por-periodo/actividad-por-periodo.service.js';
import { PrincipalesAccionesService } from './principales-acciones/principales-acciones.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [ReportesController],
  providers: [ArchivosPorTipoService, PorRangoFechasService, ReporteMasOperacionesService, TopUsuariosArchivosService, UsuariosMasCompartidosService, ArchivosMasCompartidosService, ComparticionUsuarioService, HistorialUsuarioService, ActividadPorTipoService, ActividadPorPeriodoService, PrincipalesAccionesService],
})
export class ReportesModule {}
