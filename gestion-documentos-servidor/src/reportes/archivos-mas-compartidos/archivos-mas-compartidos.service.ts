import { Injectable } from '@nestjs/common';
import { ArchivosMasCompartidosDto } from '../dto/archivos-mas-compartidos.dto.js';
import {
  ArchivoMasCompartidoFila,
  ReporteArchivosMasCompartidos,
} from '../model/archivo-mas-compartido.js';
import { Model } from 'mongoose';
import {
  Documento,
  DocumentoDocument,
} from '../../database/documento/schema/documento.schema.js';
import { InjectModel } from '@nestjs/mongoose';
import {
  DocumentoCompartido,
  DocumentoCompartidoDocument,
} from '../../database/compartido/schema/compartido.schema.js';
import {
  Usuario,
  UsuarioDocument,
} from '../../database/usuario/schema/usuario.schema.js';

@Injectable()
export class ArchivosMasCompartidosService {
  constructor(
    @InjectModel(Usuario.name)
    private readonly usuarioModel: Model<UsuarioDocument>,
    @InjectModel(Documento.name)
    private readonly documentoModel: Model<DocumentoDocument>,
    @InjectModel(DocumentoCompartido.name)
    private readonly compartidoModel: Model<DocumentoCompartidoDocument>,
  ) {}
  async archivosMasCompartidos(
    q: ArchivosMasCompartidosDto,
  ): Promise<ReporteArchivosMasCompartidos> {
    const match: Record<string, any> = { recurso_tipo: 'archivo' };

    if (q.permiso) match.permiso = q.permiso;
    if (q.desde || q.hasta) {
      match.createdAt = {};
      if (q.desde) match.createdAt.$gte = new Date(q.desde);
      if (q.hasta) match.createdAt.$lte = new Date(q.hasta);
    }

    const limite = q.limite ?? 10;

    const agrupados = await this.compartidoModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$recurso_id',
          usuarios: { $addToSet: '$usuario_destino_id' },
          propietario_id: { $first: '$propietario_id' },
          ultima_comparticion: { $max: '$createdAt' },
        },
      },
      { $addFields: { cantidad_usuarios: { $size: '$usuarios' } } },
      { $sort: { cantidad_usuarios: -1, ultima_comparticion: -1 } },
      { $limit: limite },
    ]);

    const documentosIds = agrupados
      .map((a) => a._id)
      .filter((id) => id != null);
    const propietariosIds = agrupados
      .map((a) => a.propietario_id)
      .filter((id) => id != null);

    const documentos = documentosIds.length
      ? await this.documentoModel
          .find({ _id: { $in: documentosIds } })
          .select('nombre extension')
          .lean()
      : [];

    const propietarios = propietariosIds.length
      ? await this.usuarioModel
          .find({ _id: { $in: propietariosIds } })
          .select('nombre')
          .lean()
      : [];

    const docPorId = new Map<string, any>();
    for (const d of documentos) {
      docPorId.set(String(d._id), d);
    }

    const nombrePorId = new Map<string, string>();
    for (const p of propietarios) {
      nombrePorId.set(String(p._id), p.nombre);
    }

    const datos: ArchivoMasCompartidoFila[] = agrupados.map((a, i) => {
      const doc = docPorId.get(String(a._id));
      return {
        posicion: i + 1,
        nombre: doc?.nombre ?? '(archivo eliminado)',
        extension: doc?.extension ?? '—',
        propietario:
          nombrePorId.get(String(a.propietario_id)) ?? '(usuario eliminado)',
        cantidad_usuarios: a.cantidad_usuarios,
        ultima_comparticion: a.ultima_comparticion,
      };
    });

    const totalUsuarios = datos.reduce((s, d) => s + d.cantidad_usuarios, 0);

    return {
      resumen: [
        {
          etiqueta: 'Usuarios alcanzados (top mostrado)',
          valor: totalUsuarios,
        },
      ],
      datos,
    };
  }
}
