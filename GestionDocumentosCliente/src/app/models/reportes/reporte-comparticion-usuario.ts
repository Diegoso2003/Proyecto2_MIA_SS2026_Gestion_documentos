import { ReporteResumenItem } from './reporte-response';

export interface ComparticionUsuarioFila {
  recurso_tipo: string;
  nombre_recurso: string;
  contraparte_nombre: string;
  contraparte_correo: string;
  permiso: string;
  createdAt: Date;
}

export interface ReporteComparticionesUsuario {
  usuario: {
    _id: string;
    nombre: string;
    correo: string;
    rol: string;
    activo: boolean;
  };
  resumen: ReporteResumenItem[];
  datos: ComparticionUsuarioFila[];
}
