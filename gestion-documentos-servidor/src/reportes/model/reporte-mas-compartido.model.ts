import { ReporteResumenItem } from './reporte-request.dto.js';

export interface UsuarioMasCompartidosFila {
  posicion: number;
  nombre: string;
  correo: string;
  recursos_distintos: number;
  total_comparticiones: number;
  usuarios_destino: number;
}

export interface ReporteUsuariosMasCompartidos {
  resumen: ReporteResumenItem[];
  datos: UsuarioMasCompartidosFila[];
}
