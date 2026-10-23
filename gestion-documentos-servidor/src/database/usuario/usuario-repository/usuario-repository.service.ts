import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Usuario, UsuarioDocument } from '../schema/usuario.schema.js';
import { Model, QueryFilter, Types } from 'mongoose';
import { UsuarioFiltroDto } from '../../../usuario/dto/usuario-filtro.dto.js';

@Injectable()
export class UsuarioRepositoryService {
  constructor(
    @InjectModel(Usuario.name)
    private readonly usuarioModel: Model<UsuarioDocument>,
  ) {}
  async buscarTodos(filtros: UsuarioFiltroDto) {
    const usuarioFiltro: QueryFilter<UsuarioDocument> = {};

    if (filtros.nombre) {
      usuarioFiltro.nombre = { $regex: filtros.nombre, $options: 'i' };
    }
    if (filtros.correo) {
      usuarioFiltro.correo = filtros.correo;
    }
    if (filtros.rol) {
      usuarioFiltro.rol = filtros.rol;
    }
    if (filtros.estado !== undefined) {
      usuarioFiltro.activo = filtros.estado;
    }

    return this.usuarioModel.find(usuarioFiltro).exec();
  }

  async buscarPorId(id: string | Types.ObjectId) {
    return this.usuarioModel.findById(id).exec();
  }

  async buscarPorCorreo(correo: string) {
    return this.usuarioModel
      .findOne({ correo })
      .select('+contraseña_hash')
      .exec();
  }

  async crear(datos: Partial<Usuario>) {
    const nuevoUsuario = new this.usuarioModel(datos);
    return nuevoUsuario.save();
  }

  async actualizar(id: string | Types.ObjectId, datos: Partial<Usuario>) {
    return this.usuarioModel.findByIdAndUpdate(id, datos, { new: true }).exec();
  }

  async guardarDocumento(usuario: UsuarioDocument) {
    return usuario.save();
  }
}
