import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Documento,
  DocumentoDocument,
} from '../../database/documento/schema/documento.schema.js';
import { Model, Types } from 'mongoose';
import {
  ArchivoPorRangoFila,
  ReporteArchivosPorRango,
} from '../model/reporte-rango-fecha.model.js';
import { ArchivosPorRangoDto } from '../dto/archivos-por-rango.dto.js';
import {
  Usuario,
  UsuarioDocument,
} from '../../database/usuario/schema/usuario.schema.js';
import { ArchivosPorTipoService } from '../archivos-por-tipo/archivos-por-tipo.service.js';

@Injectable()
export class PorRangoFechasService {
  constructor(
    @InjectModel(Documento.name)
    private readonly documentoModel: Model<DocumentoDocument>,
    @InjectModel(Usuario.name)
    private readonly usuarioModel: Model<UsuarioDocument>,
    private readonly archivosPorTipo: ArchivosPorTipoService,
  ) {}

  async archivosPorRangoFechas(
    q: ArchivosPorRangoDto,
  ): Promise<ReporteArchivosPorRango> {
    const page = q.page ?? 1;
    const limit = q.limit ?? 20;
    const skip = (page - 1) * limit;

    const match: Record<string, any> = { fecha_eliminacion: null };

    if (q.extension) match.extension = q.extension;
    if (q.propietarioId)
      match.propietario_id = new Types.ObjectId(q.propietarioId);
    if (q.desde || q.hasta) {
      match.createdAt = {};
      if (q.desde) match.createdAt.$gte = new Date(q.desde);
      if (q.hasta) match.createdAt.$lte = new Date(q.hasta);
    }

    const documentos = await this.documentoModel
      .find(match)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select(
        'nombre extension tipo_mime tamano_bytes propietario_id createdAt',
      )
      .lean();

    const totales = await this.documentoModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          bytes: { $sum: '$tamano_bytes' },
        },
      },
    ]);

    const total = totales[0]?.total ?? 0;
    const bytes = totales[0]?.bytes ?? 0;

    const propietariosIds = documentos
      .map((d) => d.propietario_id)
      .filter((id) => id != null);

    const propietarios = propietariosIds.length
      ? await this.usuarioModel
          .find({ _id: { $in: propietariosIds } })
          .select('nombre')
          .lean()
      : [];

    const nombrePorId = new Map<string, string>();
    for (const p of propietarios) {
      nombrePorId.set(String(p._id), p.nombre);
    }

    const datos: ArchivoPorRangoFila[] = documentos.map((d) => ({
      nombre: d.nombre,
      extension: d.extension,
      tipo_mime: d.tipo_mime,
      tamano_bytes: d.tamano_bytes,
      propietario:
        nombrePorId.get(String(d.propietario_id)) ?? '(usuario eliminado)',
      createdAt: d.createdAt!,
    }));

    return {
      resumen: [
        { etiqueta: 'Archivos en el rango', valor: total },
        {
          etiqueta: 'Tamaño acumulado',
          valor: this.archivosPorTipo.formatearBytes(bytes),
        },
      ],
      datos,
      paginacion: { total, page, limit },
    };
  }
}
