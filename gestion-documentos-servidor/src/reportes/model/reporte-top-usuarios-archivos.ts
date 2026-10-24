import { ReporteResumenItem } from './reporte-request.dto.js';

export interface TopUsuarioArchivoFila {
  posicion: number;
  nombre: string;
  correo: string;
  cantidad_archivos: number;
  tamano_total: number;
}

export interface ReporteTopUsuariosArchivos {
  resumen: ReporteResumenItem[];
  datos: TopUsuarioArchivoFila[];
}
