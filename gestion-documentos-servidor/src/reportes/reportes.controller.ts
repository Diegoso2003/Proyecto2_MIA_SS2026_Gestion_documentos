import { Controller, Get, Query } from '@nestjs/common';
import { ArchivosPorTipoService } from './archivos-por-tipo/archivos-por-tipo.service.js';
import { ArchivosPorTipoDto } from './dto/archivos-por-tipo.dto.js';
import { Rol } from '../usuario/Rol.js';
import { Roles } from '../decorators/roles/roles.decorator.js';
import { PorRangoFechasService } from './por-rango-fechas/por-rango-fechas.service.js';
import { ArchivosPorRangoDto } from './dto/archivos-por-rango.dto.js';

@Roles(Rol.ADMIN)
@Controller('reportes')
export class ReportesController {
  constructor(
    private readonly archivosPorTipoService: ArchivosPorTipoService,
    private readonly archivosPorFecha: PorRangoFechasService,
  ) {}
  @Get('archivos/por-tipo')
  async archivosPorTipo(@Query() q: ArchivosPorTipoDto) {
    return await this.archivosPorTipoService.archivosPorTipo(q);
  }

  @Get('archivos/por-rango-fechas')
  archivosPorRango(@Query() q: ArchivosPorRangoDto) {
    return this.archivosPorFecha.archivosPorRangoFechas(q);
  }
}
