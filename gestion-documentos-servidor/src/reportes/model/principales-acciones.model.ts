import { ReporteResumenItem } from './reporte-request.dto.js';

export interface PrincipalAccionFila {
  posicion: number;
  accion: string;
  cantidad: number;
  porcentaje: number;
  ultima_vez: Date;
}

export interface ReportePrincipalesAcciones {
  resumen: ReporteResumenItem[];
  datos: PrincipalAccionFila[];
}
