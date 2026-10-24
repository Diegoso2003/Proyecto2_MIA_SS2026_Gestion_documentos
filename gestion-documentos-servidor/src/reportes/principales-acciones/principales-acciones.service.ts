import { Injectable } from '@nestjs/common';
import { PrincipalesAccionesDto } from '../dto/principales-acciones.dto.js';
import {
  PrincipalAccionFila,
  ReportePrincipalesAcciones,
} from '../model/principales-acciones.model.js';
import { InjectModel } from '@nestjs/mongoose';
import {
  Historial,
  HistorialDocument,
} from '../../database/historial/schema/historial.schema.js';
import { Model } from 'mongoose';

@Injectable()
export class PrincipalesAccionesService {
  constructor(
    @InjectModel(Historial.name)
    private readonly historialModel: Model<HistorialDocument>,
  ) {}
  async principalesAcciones(
    q: PrincipalesAccionesDto,
  ): Promise<ReportePrincipalesAcciones> {
    const match: Record<string, any> = {};

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
          ultima_vez: { $max: '$createdAt' },
        },
      },
      {
        $project: {
          _id: 0,
          accion: '$_id',
          cantidad: 1,
          ultima_vez: 1,
        },
      },
      { $sort: { cantidad: -1 } },
    ]);

    const total = agrupados.reduce((s, a) => s + a.cantidad, 0);

    const limite = q.limite ?? 5;
    const top = agrupados.slice(0, limite);

    const datos: PrincipalAccionFila[] = top.map((a, i) => ({
      posicion: i + 1,
      accion: a.accion,
      cantidad: a.cantidad,
      porcentaje: total > 0 ? Math.round((a.cantidad / total) * 1000) / 10 : 0,
      ultima_vez: a.ultima_vez,
    }));

    return {
      resumen: [
        { etiqueta: 'Operaciones totales', valor: total },
        { etiqueta: 'Acciones mostradas', valor: datos.length },
      ],
      datos,
    };
  }
}
