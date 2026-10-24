import { Controller, Get, Query } from '@nestjs/common';
import { ArchivosPorTipoService } from './archivos-por-tipo/archivos-por-tipo.service.js';
import { ArchivosPorTipoDto } from './dto/archivos-por-tipo.dto.js';
import { Rol } from '../usuario/Rol.js';
import { Roles } from '../decorators/roles/roles.decorator.js';
import { PorRangoFechasService } from './por-rango-fechas/por-rango-fechas.service.js';
import { ArchivosPorRangoDto } from './dto/archivos-por-rango.dto.js';
import { ReporteMasOperacionesService } from './reporte-mas-operaciones/reporte-mas-operaciones.service.js';
import { ArchivosMasOperacionesDto } from './dto/archivos-mas-operaciones.dto.js';
import { TopUsuariosArchivosDto } from './dto/top-usuarios-archivos.dto.js';
import { TopUsuariosArchivosService } from './top-usuarios-archivos/top-usuarios-archivos.service.js';
import { UsuariosMasCompartidosService } from './usuarios-mas-compartidos/usuarios-mas-compartidos.service.js';
import { UsuariosMasCompartidosDto } from './dto/archivos-mas-compartidos.js';
import { ArchivosMasCompartidosService } from './archivos-mas-compartidos/archivos-mas-compartidos.service.js';
import { ArchivosMasCompartidosDto } from './dto/archivos-mas-compartidos.dto.js';

@Roles(Rol.ADMIN)
@Controller('reportes')
export class ReportesController {
  constructor(
    private readonly archivosPorTipoService: ArchivosPorTipoService,
    private readonly archivosPorFecha: PorRangoFechasService,
    private readonly archivosMasOperaciones: ReporteMasOperacionesService,
    private readonly usuariosArchivos: TopUsuariosArchivosService,
    private readonly masCompartidos: UsuariosMasCompartidosService,
    private readonly archivosMasComp: ArchivosMasCompartidosService,
  ) {}
  @Get('archivos/por-tipo')
  async archivosPorTipo(@Query() q: ArchivosPorTipoDto) {
    return await this.archivosPorTipoService.archivosPorTipo(q);
  }

  @Get('archivos/por-rango-fechas')
  async archivosPorRango(@Query() q: ArchivosPorRangoDto) {
    return await this.archivosPorFecha.archivosPorRangoFechas(q);
  }
  @Get('archivos/mas-operaciones')
  async archivosMasOpera(@Query() q: ArchivosMasOperacionesDto) {
    return await this.archivosMasOperaciones.archivosMasOperaciones(q);
  }

  @Get('usuarios/top-archivos')
  async topUsuariosArchivos(@Query() q: TopUsuariosArchivosDto) {
    return await this.usuariosArchivos.topUsuariosConArchivos(q);
  }

  @Get('usuarios/mas-compartidos')
  async usuariosMasCompartidos(@Query() q: UsuariosMasCompartidosDto) {
    return await this.masCompartidos.usuariosMasCompartidos(q);
  }

  @Get('comparticion/archivos-mas-compartidos')
  async archivosMasCompartidos(@Query() q: ArchivosMasCompartidosDto) {
    return await this.archivosMasComp.archivosMasCompartidos(q);
  }
}
