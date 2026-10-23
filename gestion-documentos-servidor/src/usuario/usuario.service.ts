import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioEstadoDTO } from './dto/update-usuario-estado.dto.js';
import { UpdateUsuarioPassword } from './dto/update-usuario-password.dto.js';
import { UsuarioFiltroDto } from './dto/usuario-filtro.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import { EncriptadorService } from '../seguridad/encriptador/encriptador.service.js';
import { UsuarioRepositoryService } from '../database/usuario/usuario-repository/usuario-repository.service.js';

@Injectable()
export class UsuarioService {
  constructor(
    private readonly usuarioRepository: UsuarioRepositoryService,
    private readonly encriptador: EncriptadorService,
  ) {}

  findAll(filtros: UsuarioFiltroDto) {
    return this.usuarioRepository.buscarTodos(filtros);
  }

  async updatePassword(id: string, nuevaContra: UpdateUsuarioPassword) {
    const usuario = await this.usuarioRepository.buscarPorId(id);
    if (!usuario) {
      throw new NotFoundException(`No se encontró un usuario con id: ${id}`);
    }

    const nuevaPassword = await this.encriptador.hashConstraseña(
      nuevaContra.contraseña,
    );
    usuario.contraseña_hash = nuevaPassword;

    await this.usuarioRepository.guardarDocumento(usuario);
  }

  async updateEstado(id: string, estadoUsuario: UpdateUsuarioEstadoDTO) {
    const usuario = await this.usuarioRepository.buscarPorId(id);
    if (!usuario) {
      throw new NotFoundException(`No se encontró un usuario con id: ${id}`);
    }

    usuario.activo = estadoUsuario.estado;

    await this.usuarioRepository.guardarDocumento(usuario);
  }

  async create(createUsuarioDto: CreateUsuarioDto) {
    const existe = await this.usuarioRepository.buscarPorCorreo(
      createUsuarioDto.correo,
    );
    if (existe) {
      throw new BadRequestException(
        'Ya existe un usuario registrado con este correo',
      );
    }

    const passwordHasheada = await this.encriptador.hashConstraseña(
      createUsuarioDto.contraseña,
    );

    return await this.usuarioRepository.crear({
      correo: createUsuarioDto.correo,
      nombre: createUsuarioDto.nombre,
      rol: createUsuarioDto.rol,
      contraseña_hash: passwordHasheada,
      activo: true,
    });
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = await this.usuarioRepository.buscarPorId(id);
    if (!usuario) {
      throw new NotFoundException('No se encontró al usuario');
    }

    if (usuario.correo !== updateUsuarioDto.correo) {
      const existe = await this.usuarioRepository.buscarPorCorreo(
        updateUsuarioDto.correo,
      );
      if (existe) {
        throw new BadRequestException('Ya existe un usuario con este correo');
      }
    }

    return await this.usuarioRepository.actualizar(id, {
      nombre: updateUsuarioDto.nombre,
      correo: updateUsuarioDto.correo,
      rol: updateUsuarioDto.rol,
    });
  }
}
