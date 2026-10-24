import { Injectable } from '@nestjs/common';
import { ActividadPorPeriodoDto } from '../dto/actividad-por-periodo.dto.js';
import {
  ActividadPorPeriodoFila,
  ReporteActividadPorPeriodo,
} from '../model/actividad-por-periodo.model.js';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  Historial,
  HistorialDocument,
} from '../../database/historial/schema/historial.schema.js';

@Injectable()
export class ActividadPorPeriodoService {
  constructor(
    @InjectModel(Historial.name)
    private readonly historialModel: Model<HistorialDocument>,
  ) {}
  async actividadPorPeriodo(
    q: ActividadPorPeriodoDto,
  ): Promise<ReporteActividadPorPeriodo> {
    const match: Record<string, any> = {};

    if (q.usuarioId) match.usuario_id = new Types.ObjectId(q.usuarioId);
    if (q.desde || q.hasta) {
      match.createdAt = {};
      if (q.desde) match.createdAt.$gte = new Date(q.desde);
      if (q.hasta) match.createdAt.$lte = new Date(q.hasta);
    }

    const formatoPorPeriodo: Record<string, string> = {
      dia: '%Y-%m-%d',
      semana: '%G-W%V',
      mes: '%Y-%m',
    };
    const formato = formatoPorPeriodo[q.periodo ?? 'dia'];

    const agrupados = await this.historialModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            $dateToString: {
              format: formato,
              date: '$createdAt',
            },
          },
          cantidad: { $sum: 1 },
          usuarios: { $addToSet: '$usuario_id' },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          periodo: '$_id',
          cantidad: 1,
          usuarios_distintos: { $size: '$usuarios' },
        },
      },
    ]);

    const datos: ActividadPorPeriodoFila[] = agrupados.map((a) => ({
      periodo: a.periodo,
      cantidad: a.cantidad,
      usuarios_distintos: a.usuarios_distintos,
    }));

    const total = datos.reduce((s, d) => s + d.cantidad, 0);
    const promedio = datos.length
      ? Math.round((total / datos.length) * 10) / 10
      : 0;

    let pico: ActividadPorPeriodoFila | null = null;
    for (const d of datos) {
      if (!pico || d.cantidad > pico.cantidad) pico = d;
    }

    return {
      resumen: [
        { etiqueta: 'Operaciones', valor: total },
        { etiqueta: 'Promedio por período', valor: promedio },
        {
          etiqueta: 'Período pico',
          valor: pico ? `${pico.periodo} (${pico.cantidad})` : '—',
        },
      ],
      datos,
    };
  }
}
