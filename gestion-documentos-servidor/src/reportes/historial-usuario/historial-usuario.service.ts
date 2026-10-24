import { Injectable, NotFoundException } from '@nestjs/common';
import { HistorialUsuarioDto } from '../dto/historial-usuario.dto.js';
import {
  HistorialUsuarioFila,
  ReporteHistorialUsuario,
} from '../model/historial-usuario.js';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  Usuario,
  UsuarioDocument,
} from '../../database/usuario/schema/usuario.schema.js';
import {
  Historial,
  HistorialDocument,
} from '../../database/historial/schema/historial.schema.js';

@Injectable()
export class HistorialUsuarioService {
  constructor(
    @InjectModel(Usuario.name)
    private readonly usuarioModel: Model<UsuarioDocument>,
    @InjectModel(Historial.name)
    private readonly historialModel: Model<HistorialDocument>,
  ) {}
  async historialUsuario(
    q: HistorialUsuarioDto,
  ): Promise<ReporteHistorialUsuario> {
    const usuario = await this.usuarioModel
      .findById(q.usuarioId)
      .select('nombre correo rol activo')
      .lean();

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const page = q.page ?? 1;
    const limit = q.limit ?? 20;
    const skip = (page - 1) * limit;

    const match: Record<string, any> = {
      usuario_id: new Types.ObjectId(q.usuarioId),
    };

    if (q.accion) match.accion = q.accion;
    if (q.desde || q.hasta) {
      match.createdAt = {};
      if (q.desde) match.createdAt.$gte = new Date(q.desde);
      if (q.hasta) match.createdAt.$lte = new Date(q.hasta);
    }

    const registros = await this.historialModel
      .find(match)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('createdAt accion descripcion')
      .lean();

    const totales = await this.historialModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          ultima: { $max: '$createdAt' },
        },
      },
    ]);

    const total = totales[0]?.total ?? 0;
    const ultima = totales[0]?.ultima ?? null;

    const datos: HistorialUsuarioFila[] = registros.map((r) => ({
      createdAt: r.createdAt,
      accion: r.accion,
      descripcion: r.descripcion,
    }));

    return {
      usuario: {
        _id: String(usuario._id),
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
        activo: usuario.activo,
      },
      resumen: [
        { etiqueta: 'Acciones registradas', valor: total },
        {
          etiqueta: 'Última actividad',
          valor: ultima ? new Date(ultima).toISOString() : '—',
        },
      ],
      datos,
      paginacion: { total, page, limit },
    };
  }
}
