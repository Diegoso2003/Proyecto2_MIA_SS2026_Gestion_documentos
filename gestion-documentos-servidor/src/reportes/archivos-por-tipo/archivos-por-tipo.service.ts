import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Documento,
  DocumentoDocument,
} from '../../database/documento/schema/documento.schema.js';
import { ArchivosPorTipoDto } from '../dto/archivos-por-tipo.dto.js';
import { ReporteArchivosPorTipo } from '../model/reporte-request.dto.js';

@Injectable()
export class ArchivosPorTipoService {
  constructor(
    @InjectModel(Documento.name)
    private readonly documentoModel: Model<DocumentoDocument>,
  ) {}

  async archivosPorTipo(
    q: ArchivosPorTipoDto,
  ): Promise<ReporteArchivosPorTipo> {
    const match: Record<string, any> = {};

    if (!q.incluirEliminados) {
      match.fecha_eliminacion = null;
    }
    if (q.propietarioId) {
      match.propietario_id = new Types.ObjectId(q.propietarioId);
    }
    if (q.desde || q.hasta) {
      match.createdAt = {};
      if (q.desde) match.createdAt.$gte = new Date(q.desde);
      if (q.hasta) match.createdAt.$lte = new Date(q.hasta);
    }

    const filas = await this.documentoModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: { extension: '$extension', tipo_mime: '$tipo_mime' },
          cantidad: { $sum: 1 },
          tamano_total: { $sum: '$tamano_bytes' },
          tamano_promedio: { $avg: '$tamano_bytes' },
        },
      },
      { $sort: { cantidad: -1 } },
      {
        $project: {
          _id: 0,
          extension: '$_id.extension',
          tipo_mime: '$_id.tipo_mime',
          cantidad: 1,
          tamano_total: 1,
          tamano_promedio: { $round: ['$tamano_promedio', 0] },
        },
      },
    ]);

    const totalArchivos = filas.reduce((s, f) => s + f.cantidad, 0);
    const totalBytes = filas.reduce((s, f) => s + f.tamano_total, 0);

    return {
      resumen: [
        { etiqueta: 'Total de archivos', valor: totalArchivos },
        {
          etiqueta: 'Almacenamiento total',
          valor: this.formatearBytes(totalBytes),
        },
        { etiqueta: 'Tipos distintos', valor: filas.length },
      ],
      datos: filas,
    };
  }

  formatearBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    const unidades = ['KB', 'MB', 'GB', 'TB'];
    let valor = bytes / 1024;
    let i = 0;
    while (valor >= 1024 && i < unidades.length - 1) {
      valor /= 1024;
      i++;
    }
    return `${valor.toFixed(1)} ${unidades[i]}`;
  }
}
