import { ReporteResumenItem } from './reporte-response';

export interface ArchivoMasOperacionesFila {
  posicion: number;
  nombre: string;
  extension: string;
  operaciones: number;
  usuarios_distintos: number;
  ultima_operacion: Date;
  eliminado: boolean;
}

export interface ReporteArchivosMasOperaciones {
  resumen: ReporteResumenItem[];
  datos: ArchivoMasOperacionesFila[];
}

export interface ReporteArchivosMasOperaciones {
  resumen: ReporteResumenItem[];
  datos: ArchivoMasOperacionesFila[];
}
