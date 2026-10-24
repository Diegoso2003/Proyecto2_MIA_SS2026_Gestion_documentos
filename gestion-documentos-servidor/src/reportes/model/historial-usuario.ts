import { ReportePaginacion } from './reporte-rango-fecha.model.js';
import { ReporteResumenItem } from './reporte-request.dto.js';

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
