import { Injectable, NotFoundException } from '@nestjs/common';
import { RecursosUsuarioDto } from '../dto/recursos-usuario.dto.js';
import {
  ComparticionUsuarioFila,
  ReporteComparticionesUsuario,
} from '../model/reporte-comparticion-usuario.js';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  Usuario,
  UsuarioDocument,
} from '../../database/usuario/schema/usuario.schema.js';
import {
  Documento,
  DocumentoDocument,
} from '../../database/documento/schema/documento.schema.js';
import {
  DocumentoCompartido,
  DocumentoCompartidoDocument,
} from '../../database/compartido/schema/compartido.schema.js';
import {
  Carpeta,
  CarpetaDocument,
} from '../../database/carpeta/schema/carpeta.schema.js';

@Injectable()
export class ComparticionUsuarioService {
  constructor(
    @InjectModel(Usuario.name)
    private readonly usuarioModel: Model<UsuarioDocument>,
    @InjectModel(Documento.name)
    private readonly documentoModel: Model<DocumentoDocument>,
    @InjectModel(DocumentoCompartido.name)
    private readonly compartidoModel: Model<DocumentoCompartidoDocument>,
    @InjectModel(Carpeta.name)
    private readonly carpetaModel: Model<CarpetaDocument>,
  ) {}
  async compartidosPorUsuario(
    q: RecursosUsuarioDto,
  ): Promise<ReporteComparticionesUsuario> {
    return this.comparticionesDeUsuario(
      q,
      'propietario_id',
      'usuario_destino_id',
      'Recursos compartidos',
    );
  }

  async recibidosPorUsuario(
    q: RecursosUsuarioDto,
  ): Promise<ReporteComparticionesUsuario> {
    return this.comparticionesDeUsuario(
      q,
      'usuario_destino_id',
      'propietario_id',
      'Recursos recibidos',
    );
  }

  private async comparticionesDeUsuario(
    q: RecursosUsuarioDto,
    campoUsuario: 'propietario_id' | 'usuario_destino_id',
    campoContraparte: 'propietario_id' | 'usuario_destino_id',
    etiquetaTotal: string,
  ): Promise<ReporteComparticionesUsuario> {
    const usuario = await this.usuarioModel
      .findById(q.usuarioId)
      .select('nombre correo rol activo')
      .lean();

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const match: Record<string, any> = {
      [campoUsuario]: new Types.ObjectId(q.usuarioId),
    };
    if (q.recursoTipo) match.recurso_tipo = q.recursoTipo;
    if (q.permiso) match.permiso = q.permiso;

    const comparticiones = await this.compartidoModel
      .find(match)
      .sort({ createdAt: -1 })
      .select('recurso_tipo recurso_id permiso createdAt ' + campoContraparte)
      .lean();

    const documentosIds = comparticiones
      .filter((c) => c.recurso_tipo === 'archivo')
      .map((c) => c.recurso_id)
      .filter((id) => id != null);

    const documentos = documentosIds.length
      ? await this.documentoModel
          .find({ _id: { $in: documentosIds } })
          .select('nombre')
          .lean()
      : [];

    const carpetasIds = comparticiones
      .filter((c) => c.recurso_tipo === 'carpeta')
      .map((c) => c.recurso_id)
      .filter((id) => id != null);

    const carpetas = carpetasIds.length
      ? await this.carpetaModel
          .find({ _id: { $in: carpetasIds } })
          .select('nombre')
          .lean()
      : [];

    const contrapartesIds = comparticiones
      .map((c) => c[campoContraparte])
      .filter((id) => id != null);

    const contrapartes = contrapartesIds.length
      ? await this.usuarioModel
          .find({ _id: { $in: contrapartesIds } })
          .select('nombre correo')
          .lean()
      : [];

    const docPorId = new Map<string, string>();
    for (const d of documentos) docPorId.set(String(d._id), d.nombre);

    const carpetaPorId = new Map<string, string>();
    for (const c of carpetas) carpetaPorId.set(String(c._id), c.nombre);

    const contrapartePorId = new Map<string, any>();
    for (const c of contrapartes) contrapartePorId.set(String(c._id), c);

    const datos: ComparticionUsuarioFila[] = comparticiones.map((c) => {
      const esArchivo = c.recurso_tipo === 'archivo';
      const nombre = esArchivo
        ? docPorId.get(String(c.recurso_id))
        : carpetaPorId.get(String(c.recurso_id));

      const contraparte = contrapartePorId.get(String(c[campoContraparte]));

      return {
        recurso_tipo: c.recurso_tipo,
        nombre_recurso: nombre ?? '(recurso eliminado)',
        contraparte_nombre: contraparte?.nombre ?? '(usuario eliminado)',
        contraparte_correo: contraparte?.correo ?? '—',
        permiso: c.permiso,
        createdAt: (c as any).createdAt,
      };
    });

    const archivos = datos.filter((d) => d.recurso_tipo === 'archivo').length;
    const carpetasCount = datos.filter(
      (d) => d.recurso_tipo === 'carpeta',
    ).length;

    return {
      usuario: {
        _id: String(usuario._id),
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
        activo: usuario.activo,
      },
      resumen: [
        { etiqueta: etiquetaTotal, valor: datos.length },
        { etiqueta: 'Archivos', valor: archivos },
        { etiqueta: 'Carpetas', valor: carpetasCount },
      ],
      datos,
    };
  }
}
