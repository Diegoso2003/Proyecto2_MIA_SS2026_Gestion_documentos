import { ReportePaginacion } from './reporte-rango-fecha';
import { ReporteResumenItem } from './reporte-response';

export interface HistorialUsuarioFila {
  createdAt: Date;
  accion: string;
  descripcion: string;
}

export interface ReporteHistorialUsuario {
  usuario: {
    _id: string;
    nombre: string;
    correo: string;
    rol: string;
    activo: boolean;
  };
  resumen: ReporteResumenItem[];
  datos: HistorialUsuarioFila[];
  paginacion: ReportePaginacion;
}
