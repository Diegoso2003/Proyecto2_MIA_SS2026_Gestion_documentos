import { Injectable } from '@nestjs/common';
import { UsuariosMasCompartidosDto } from '../dto/archivos-mas-compartidos.js';
import {
  ReporteUsuariosMasCompartidos,
  UsuarioMasCompartidosFila,
} from '../model/reporte-mas-compartido.model.js';
import { Model } from 'mongoose';
import {
  DocumentoCompartido,
  DocumentoCompartidoDocument,
} from '../../database/compartido/schema/compartido.schema.js';
import { InjectModel } from '@nestjs/mongoose';
import {
  Usuario,
  UsuarioDocument,
} from '../../database/usuario/schema/usuario.schema.js';

@Injectable()
export class UsuariosMasCompartidosService {
  constructor(
    @InjectModel(Usuario.name)
    private readonly usuarioModel: Model<UsuarioDocument>,
    @InjectModel(DocumentoCompartido.name)
    private readonly compartidoModel: Model<DocumentoCompartidoDocument>,
  ) {}
  async usuariosMasCompartidos(
    q: UsuariosMasCompartidosDto,
  ): Promise<ReporteUsuariosMasCompartidos> {
    const match: Record<string, any> = {};

    if (q.recursoTipo) match.recurso_tipo = q.recursoTipo;
    if (q.permiso) match.permiso = q.permiso;
    if (q.desde || q.hasta) {
      match.createdAt = {};
      if (q.desde) match.createdAt.$gte = new Date(q.desde);
      if (q.hasta) match.createdAt.$lte = new Date(q.hasta);
    }

    const agrupados = await this.compartidoModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$propietario_id',
          total_comparticiones: { $sum: 1 },
          recursos: { $addToSet: '$recurso_id' },
          destinos: { $addToSet: '$usuario_destino_id' },
        },
      },
      {
        $project: {
          total_comparticiones: 1,
          recursos_distintos: { $size: '$recursos' },
          usuarios_destino: { $size: '$destinos' },
        },
      },
      { $sort: { recursos_distintos: -1, total_comparticiones: -1 } },
      { $limit: 10 },
    ]);

    const usuariosIds = agrupados.map((a) => a._id).filter((id) => id != null);
    const usuarios = usuariosIds.length
      ? await this.usuarioModel
          .find({ _id: { $in: usuariosIds } })
          .select('nombre correo')
          .lean()
      : [];

    const usuarioPorId = new Map<string, any>();
    for (const u of usuarios) {
      usuarioPorId.set(String(u._id), u);
    }

    const datos: UsuarioMasCompartidosFila[] = agrupados.map((a, i) => {
      const u = usuarioPorId.get(String(a._id));
      return {
        posicion: i + 1,
        nombre: u?.nombre ?? '(usuario eliminado)',
        correo: u?.correo ?? '—',
        recursos_distintos: a.recursos_distintos,
        total_comparticiones: a.total_comparticiones,
        usuarios_destino: a.usuarios_destino,
      };
    });

    const totalComparticiones = datos.reduce(
      (s, d) => s + d.total_comparticiones,
      0,
    );

    return {
      resumen: [
        { etiqueta: 'Comparticiones del top', valor: totalComparticiones },
      ],
      datos,
    };
  }
}
