import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  DocumentoCompartido,
  DocumentoCompartidoDocument,
} from '../../database/compartido/schema/compartido.schema.js';
import {
  Usuario,
  UsuarioDocument,
} from '../../database/usuario/schema/usuario.schema.js';
import {
  Documento,
  DocumentoDocument,
} from '../../database/documento/schema/documento.schema.js';
import {
  Carpeta,
  CarpetaDocument,
} from '../../database/carpeta/schema/carpeta.schema.js';
import {
  CompartidoFila,
  ListaCompartidos,
} from '../models/compartido.model.js';
import { CompartirRecursoDto } from '../dto/create-compartido.dto.js';
import { ActualizarPermisoDto } from '../dto/update-compartido.dto.js';
import { Permiso } from '../dto/permiso.js';
import { RevocarPermisoDto } from '../dto/rovocado-permiso.dto.js';
import { ListarCompartidosDto } from '../dto/listar-compartidos.dto.js';

@Injectable()
export class ManejoPermisosService {
  constructor(
    @InjectModel(DocumentoCompartido.name)
    private readonly compartidoModel: Model<DocumentoCompartidoDocument>,

    @InjectModel(Usuario.name)
    private readonly usuarioModel: Model<UsuarioDocument>,

    @InjectModel(Documento.name)
    private readonly documentoModel: Model<DocumentoDocument>,

    @InjectModel(Carpeta.name)
    private readonly carpetaModel: Model<CarpetaDocument>,
  ) {}

  private async validarPropietario(
    usuario: UsuarioDocument,
    recursoId: string,
    recursoTipo: 'archivo' | 'carpeta',
  ): Promise<void> {
    const recursoObjectId = new Types.ObjectId(recursoId);

    if (recursoTipo === 'archivo') {
      const existe = await this.documentoModel.exists({
        _id: recursoObjectId,
        propietario_id: usuario._id,
      });
      if (!existe) {
        throw new ForbiddenException('no tienes permiso sobre este recurso');
      }
      return;
    }

    const existe = await this.carpetaModel.exists({
      _id: recursoObjectId,
      propietario_id: usuario._id,
    });
    if (!existe) {
      throw new ForbiddenException('no tienes permiso sobre este recurso');
    }
  }

  async listar(
    usuario: UsuarioDocument,
    dto: ListarCompartidosDto,
  ): Promise<ListaCompartidos> {
    await this.validarPropietario(usuario, dto.recursoId, dto.recursoTipo);

    const recursoObjectId = new Types.ObjectId(dto.recursoId);

    const compartidos = await this.compartidoModel
      .find({ recurso_id: recursoObjectId })
      .select('usuario_destino_id permiso')
      .lean();

    const usuariosIds = compartidos.map((c) => c.usuario_destino_id);
    const usuarios = usuariosIds.length
      ? await this.usuarioModel
          .find({ _id: { $in: usuariosIds } })
          .select('nombre correo')
          .lean()
      : [];

    const usuarioPorId = new Map<string, any>();
    for (const u of usuarios) usuarioPorId.set(String(u._id), u);

    const datos: CompartidoFila[] = compartidos
      .map((c) => {
        const u = usuarioPorId.get(String(c.usuario_destino_id));
        if (!u) return null;
        return {
          usuario_destino_id: String(c.usuario_destino_id),
          nombre: u.nombre,
          correo: u.correo,
          permiso: c.permiso,
        };
      })
      .filter((f): f is CompartidoFila => f !== null);

    return {
      propietario_id: String(usuario._id),
      recurso_id: dto.recursoId,
      recurso_tipo: dto.recursoTipo,
      datos,
    };
  }

  async compartir(
    usuario: UsuarioDocument,
    dto: CompartirRecursoDto,
  ): Promise<CompartidoFila> {
    await this.validarPropietario(usuario, dto.recursoId, dto.recursoTipo);

    const destino = await this.usuarioModel
      .findOne({ correo: dto.correo })
      .select('nombre correo')
      .lean();

    if (!destino) {
      throw new NotFoundException('no existe un usuario con ese correo');
    }

    if (String(destino._id) === String(usuario._id)) {
      throw new BadRequestException('no puedes compartir contigo mismo');
    }

    const recursoObjectId = new Types.ObjectId(dto.recursoId);

    const existente = await this.compartidoModel.findOne({
      recurso_id: recursoObjectId,
      usuario_destino_id: destino._id,
    });

    if (existente) {
      throw new ConflictException(
        'ya compartiste este recurso con ese usuario',
      );
    }

    await this.compartidoModel.create({
      propietario_id: usuario._id,
      recurso_id: recursoObjectId,
      recurso_tipo: dto.recursoTipo,
      usuario_destino_id: destino._id,
      permiso: dto.permiso as Permiso,
    });

    return {
      usuario_destino_id: String(destino._id),
      nombre: destino.nombre,
      correo: destino.correo,
      permiso: dto.permiso as Permiso,
    };
  }

  async actualizarPermiso(
    usuario: UsuarioDocument,
    dto: ActualizarPermisoDto,
  ): Promise<CompartidoFila> {
    await this.validarPropietario(usuario, dto.recursoId, dto.recursoTipo);

    const compartido = await this.compartidoModel.findOneAndUpdate(
      {
        recurso_id: new Types.ObjectId(dto.recursoId),
        usuario_destino_id: new Types.ObjectId(dto.usuarioDestinoId),
      },
      { $set: { permiso: dto.permiso } },
      { new: true },
    );

    if (!compartido) {
      throw new NotFoundException('no se encontró el permiso');
    }

    const destino = await this.usuarioModel
      .findById(dto.usuarioDestinoId)
      .select('nombre correo')
      .lean();

    if (!destino) {
      throw new NotFoundException('no se encontró el usuario destino');
    }

    return {
      usuario_destino_id: dto.usuarioDestinoId,
      nombre: destino.nombre,
      correo: destino.correo,
      permiso: compartido.permiso,
    };
  }

  async revocar(
    usuario: UsuarioDocument,
    dto: RevocarPermisoDto,
  ): Promise<void> {
    await this.validarPropietario(usuario, dto.recursoId, dto.recursoTipo);

    const resultado = await this.compartidoModel.deleteOne({
      recurso_id: new Types.ObjectId(dto.recursoId),
      usuario_destino_id: new Types.ObjectId(dto.usuarioDestinoId),
    });

    if (resultado.deletedCount === 0) {
      throw new NotFoundException('no se encontró el permiso');
    }
  }
}
