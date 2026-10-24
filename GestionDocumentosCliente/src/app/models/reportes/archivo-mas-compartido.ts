import { ReporteResumenItem } from './reporte-response';

export interface ArchivoMasCompartidoFila {
  posicion: number;
  nombre: string;
  extension: string;
  propietario: string;
  cantidad_usuarios: number;
  ultima_comparticion: Date;
}

export interface ReporteArchivosMasCompartidos {
  resumen: ReporteResumenItem[];
  datos: ArchivoMasCompartidoFila[];
}
