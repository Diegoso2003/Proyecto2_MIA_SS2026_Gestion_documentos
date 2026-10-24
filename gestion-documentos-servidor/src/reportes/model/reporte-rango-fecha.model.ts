import { ReporteResumenItem } from './reporte-request.dto.js';

export interface ReportePaginacion {
  total: number;
  page: number;
  limit: number;
}

export interface ArchivoPorRangoFila {
  nombre: string;
  extension: string;
  tipo_mime: string;
  tamano_bytes: number;
  propietario: string;
  createdAt: Date;
}

export interface ReporteArchivosPorRango {
  resumen: ReporteResumenItem[];
  datos: ArchivoPorRangoFila[];
  paginacion: ReportePaginacion;
}
