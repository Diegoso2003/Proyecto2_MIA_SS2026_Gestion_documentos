import { ReporteResumenItem } from './reporte-response';

export interface ActividadPorPeriodoFila {
  periodo: string;
  cantidad: number;
  usuarios_distintos: number;
}

export interface ReporteActividadPorPeriodo {
  resumen: ReporteResumenItem[];
  datos: ActividadPorPeriodoFila[];
}
