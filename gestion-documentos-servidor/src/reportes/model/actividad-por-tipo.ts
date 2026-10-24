import { ReporteResumenItem } from './reporte-request.dto.js';

export interface ActividadPorTipoFila {
  accion: string;
  cantidad: number;
  porcentaje: number;
  usuarios_distintos: number;
  ultima_vez: Date;
}

export interface ReporteActividadPorTipo {
  resumen: ReporteResumenItem[];
  datos: ActividadPorTipoFila[];
}
