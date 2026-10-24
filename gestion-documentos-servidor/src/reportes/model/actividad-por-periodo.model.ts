import { ReporteResumenItem } from './reporte-request.dto.js';

export interface ActividadPorPeriodoFila {
  periodo: string;
  cantidad: number;
  usuarios_distintos: number;
}

export interface ReporteActividadPorPeriodo {
  resumen: ReporteResumenItem[];
  datos: ActividadPorPeriodoFila[];
}
