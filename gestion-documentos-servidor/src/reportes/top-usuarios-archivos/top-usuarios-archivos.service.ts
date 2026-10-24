import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Documento,
  DocumentoDocument,
} from '../../database/documento/schema/documento.schema.js';
import { Model } from 'mongoose';
import { TopUsuariosArchivosDto } from '../dto/top-usuarios-archivos.dto.js';
import {
  ReporteTopUsuariosArchivos,
  TopUsuarioArchivoFila,
} from '../model/reporte-top-usuarios-archivos.js';
import {
  Usuario,
  UsuarioDocument,
} from '../../database/usuario/schema/usuario.schema.js';

@Injectable()
export class TopUsuariosArchivosService {
  constructor(
    @InjectModel(Documento.name)
    private readonly documentoModel: Model<DocumentoDocument>,
    @InjectModel(Usuario.name)
    private readonly usuarioModel: Model<UsuarioDocument>,
  ) {}
  async topUsuariosConArchivos(
    q: TopUsuariosArchivosDto,
  ): Promise<ReporteTopUsuariosArchivos> {
    const match: Record<string, any> = { fecha_eliminacion: null };
    if (!q.incluirEliminados) {
      match.fecha_eliminacion = null;
    }
    if (q.extension) match.extension = q.extension;
    if (q.desde || q.hasta) {
      match.createdAt = {};
      if (q.desde) match.createdAt.$gte = new Date(q.desde);
      if (q.hasta) match.createdAt.$lte = new Date(q.hasta);
    }

    const limite = 10;

    const agrupados = await this.documentoModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$propietario_id',
          cantidad_archivos: { $sum: 1 },
          tamano_total: { $sum: '$tamano_bytes' },
        },
      },
      { $sort: { cantidad_archivos: -1, tamano_total: -1 } },
      { $limit: limite },
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

    const datos: TopUsuarioArchivoFila[] = agrupados.map((a, i) => {
      const u = usuarioPorId.get(String(a._id));
      return {
        posicion: i + 1,
        nombre: u?.nombre ?? '(usuario eliminado)',
        correo: u?.correo ?? '—',
        cantidad_archivos: a.cantidad_archivos,
        tamano_total: a.tamano_total,
      };
    });

    const totalArchivos = datos.reduce((s, d) => s + d.cantidad_archivos, 0);

    return {
      resumen: [{ etiqueta: 'Archivos del top', valor: totalArchivos }],
      datos,
    };
  }
}
