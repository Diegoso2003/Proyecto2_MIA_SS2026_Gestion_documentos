import { Injectable } from '@nestjs/common';
import { ArchivosMasOperacionesDto } from '../dto/archivos-mas-operaciones.dto.js';
import {
  ArchivoMasOperacionesFila,
  ReporteArchivosMasOperaciones,
} from '../model/reporte-archivos-mas-operaciones.model.js';
import { InjectModel } from '@nestjs/mongoose';
import {
  Documento,
  DocumentoDocument,
} from '../../database/documento/schema/documento.schema.js';
import {
  Usuario,
  UsuarioDocument,
} from '../../database/usuario/schema/usuario.schema.js';
import { Model } from 'mongoose';
import {
  HistorialArchivo,
  HistorialArchivoDocument,
} from '../../database/historial-archivo/schema/historial-archivo.schema.js';

@Injectable()
export class ReporteMasOperacionesService {
  constructor(
    @InjectModel(Documento.name)
    private readonly documentoModel: Model<DocumentoDocument>,
    @InjectModel(Usuario.name)
    private readonly usuarioModel: Model<UsuarioDocument>,
    @InjectModel(HistorialArchivo.name)
    private readonly historialArchivoModel: Model<HistorialArchivoDocument>,
  ) {}
  async archivosMasOperaciones(
    q: ArchivosMasOperacionesDto,
  ): Promise<ReporteArchivosMasOperaciones> {
    const match: Record<string, any> = {};

    if (q.accion) match.accion = q.accion;
    if (q.desde || q.hasta) {
      match.createdAt = {};
      if (q.desde) match.createdAt.$gte = new Date(q.desde);
      if (q.hasta) match.createdAt.$lte = new Date(q.hasta);
    }

    const limite = q.limite ?? 10;

    const agrupados = await this.historialArchivoModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$documento_id',
          operaciones: { $sum: 1 },
          usuarios: { $addToSet: '$usuario_id' },
          ultima_operacion: { $max: '$createdAt' },
        },
      },
      { $sort: { operaciones: -1, ultima_operacion: -1 } },
      { $limit: limite },
    ]);

    const documentosIds = agrupados
      .map((a) => a._id)
      .filter((id) => id != null);
    const documentos = documentosIds.length
      ? await this.documentoModel
          .find({ _id: { $in: documentosIds } })
          .select('nombre extension fecha_eliminacion')
          .lean()
      : [];

    const docPorId = new Map<string, any>();
    for (const d of documentos) {
      docPorId.set(String(d._id), d);
    }

    const datos: ArchivoMasOperacionesFila[] = agrupados.map((a, i) => {
      const doc = docPorId.get(String(a._id));
      return {
        posicion: i + 1,
        nombre: doc?.nombre ?? '(archivo eliminado)',
        extension: doc?.extension ?? '—',
        operaciones: a.operaciones,
        usuarios_distintos: a.usuarios.length,
        ultima_operacion: a.ultima_operacion,
        eliminado: doc?.fecha_eliminacion != null,
      };
    });

    const totalOperaciones = datos.reduce((s, d) => s + d.operaciones, 0);

    return {
      resumen: [
        { etiqueta: 'Operaciones (top mostrado)', valor: totalOperaciones },
      ],
      datos,
    };
  }
}
