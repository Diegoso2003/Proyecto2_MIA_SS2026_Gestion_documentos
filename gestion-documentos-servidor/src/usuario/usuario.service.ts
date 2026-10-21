import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { QueryFilter } from 'mongoose';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import { Usuario, UsuarioDocument } from './schema/usuario.schema.js';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { EncriptadorService } from '../seguridad/encriptador/encriptador.service.js';
import { UpdateUsuarioEstadoDTO } from './dto/update-usuario-estado.dto.js';
import { UpdateUsuarioPassword } from './dto/update-usuario-password.dto.js';
import { UsuarioFiltroDto } from './dto/usuario-filtro.dto.js';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectModel(Usuario.name)
    private readonly usuarioModel: Model<UsuarioDocument>,
    private readonly encriptador: EncriptadorService,
  ) {}

  findAll(filtros: UsuarioFiltroDto) {
    const usuarioFiltro: QueryFilter<UsuarioDocument> = {};
    if (filtros.nombre) {
      usuarioFiltro.nombre = {
        $regex: filtros.nombre,
        $options: 'i',
      };
    }
    if (filtros.correo) {
      usuarioFiltro.correo = filtros.correo;
    }
    if (filtros.rol) {
      usuarioFiltro.rol = filtros.rol;
    }
    if (filtros.estado) {
      usuarioFiltro.activo = filtros.estado;
    }
    return this.usuarioModel.find(usuarioFiltro).exec();
  }

  async updatePassword(id: string, nuevaContra: UpdateUsuarioPassword) {
    const usuario = await this.usuarioModel.findById(id);
    if (!usuario) {
      throw new NotFoundException(`no se encontro a un usuario con id: ${id}`);
    }
    const nuevaPassword = await this.encriptador.hashConstraseña(
      nuevaContra.contraseña,
    );
    usuario.contraseña_hash = nuevaPassword;
    usuario.save();
  }

  async updateEstado(id: string, estadoUsuario: UpdateUsuarioEstadoDTO) {
    const usuario = await this.usuarioModel.findById(id);
    if (!usuario) {
      throw new NotFoundException(`no se encontro a un usuario con id: ${id}`);
    }
    usuario.activo = estadoUsuario.estado;
    usuario.save();
  }

  async create(createUsuarioDto: CreateUsuarioDto) {
    const existe = await this.usuarioModel.findOne({
      correo: createUsuarioDto.correo,
    });
    if (existe) {
      throw new BadRequestException(
        'ya existe un usuario registrado con este correo',
      );
    }
    createUsuarioDto.contraseña = await this.encriptador.hashConstraseña(
      createUsuarioDto.contraseña,
    );
    const nuevoUsuario = new this.usuarioModel({
      correo: createUsuarioDto.correo,
      nombre: createUsuarioDto.nombre,
      rol: createUsuarioDto.rol,
      contraseña_hash: createUsuarioDto.contraseña,
    });
    nuevoUsuario.save();
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = await this.usuarioModel.findById(id);
    if (!usuario) {
      throw new NotFoundException('No se encontro al usuario');
    }
    if (usuario.correo !== updateUsuarioDto.correo) {
      const existe = await this.usuarioModel.findOne({
        correo: updateUsuarioDto.correo,
      });
      if (existe) {
        throw new BadRequestException('ya existe un usuario con este correo');
      }
    }
    usuario.nombre = updateUsuarioDto.nombre;
    usuario.correo = updateUsuarioDto.correo;
    usuario.rol = updateUsuarioDto.rol;
    usuario.save();
  }
}
