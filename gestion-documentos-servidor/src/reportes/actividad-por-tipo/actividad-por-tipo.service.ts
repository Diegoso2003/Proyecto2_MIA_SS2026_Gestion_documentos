import { Injectable } from '@nestjs/common';
import { ActividadPorTipoDto } from '../dto/actividad-por-tipo.dto.js';
import {
  ActividadPorTipoFila,
  ReporteActividadPorTipo,
} from '../model/actividad-por-tipo.js';
import { Model, Types } from 'mongoose';
import {
  Historial,
  HistorialDocument,
} from '../../database/historial/schema/historial.schema.js';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ActividadPorTipoService {
  constructor(
    @InjectModel(Historial.name)
    private readonly historialModel: Model<HistorialDocument>,
  ) {}
  async actividadPorTipo(
    q: ActividadPorTipoDto,
  ): Promise<ReporteActividadPorTipo> {
    const match: Record<string, any> = {};

    if (q.usuarioId) match.usuario_id = new Types.ObjectId(q.usuarioId);
    if (q.desde || q.hasta) {
      match.createdAt = {};
      if (q.desde) match.createdAt.$gte = new Date(q.desde);
      if (q.hasta) match.createdAt.$lte = new Date(q.hasta);
    }

    const agrupados = await this.historialModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$accion',
          cantidad: { $sum: 1 },
          usuarios: { $addToSet: '$usuario_id' },
          ultima_vez: { $max: '$createdAt' },
        },
      },
      {
        $project: {
          _id: 0,
          accion: '$_id',
          cantidad: 1,
          usuarios_distintos: { $size: '$usuarios' },
          ultima_vez: 1,
        },
      },
      { $sort: { cantidad: -1 } },
    ]);

    const total = agrupados.reduce((s, a) => s + a.cantidad, 0);

    const datos: ActividadPorTipoFila[] = agrupados.map((a) => ({
      accion: a.accion,
      cantidad: a.cantidad,
      porcentaje: total > 0 ? Math.round((a.cantidad / total) * 1000) / 10 : 0,
      usuarios_distintos: a.usuarios_distintos,
      ultima_vez: a.ultima_vez,
    }));

    return {
      resumen: [
        { etiqueta: 'Operaciones totales', valor: total },
        { etiqueta: 'Tipos de operación', valor: datos.length },
      ],
      datos,
    };
  }
}
