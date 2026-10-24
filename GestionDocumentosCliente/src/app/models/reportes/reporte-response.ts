export interface ReporteResumenItem {
  etiqueta: string;
  valor: string | number;
}

export interface ArchivoPorTipoFila {
  extension: string;
  tipo_mime: string;
  cantidad: number;
  tamano_total: number;
  tamano_promedio: number;
}

export interface ReporteArchivosPorTipo {
  resumen: ReporteResumenItem[];
  datos: ArchivoPorTipoFila[];
}
