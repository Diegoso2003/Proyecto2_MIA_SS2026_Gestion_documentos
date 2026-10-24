import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CompartidoService } from './compartido.service.js';
import { GetUsuario } from '../decorators/get-usuario/get-usuario.decorator.js';
import type { UsuarioDocument } from '../database/usuario/schema/usuario.schema.js';
import { ManejoPermisosService } from './manejo-permisos/manejo-permisos.service.js';
import { ActualizarPermisoDto } from './dto/update-compartido.dto.js';
import { RevocarPermisoDto } from './dto/rovocado-permiso.dto.js';
import { ListarCompartidosDto } from './dto/listar-compartidos.dto.js';
import { CompartirRecursoDto } from './dto/create-compartido.dto.js';

@Controller('compartido')
export class CompartidoController {
  constructor(
    private readonly compartidoService: CompartidoService,
    private readonly manejoPermisos: ManejoPermisosService,
  ) {}

  @Get('carpeta')
  async findAll(@GetUsuario() usuario: UsuarioDocument) {
    return await this.compartidoService.findAll(usuario);
  }

  @Get('carpeta/:id')
  async findOne(
    @GetUsuario() usuario: UsuarioDocument,
    @Param('id') id: string,
  ) {
    return await this.compartidoService.findOne(usuario, id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.compartidoService.remove(+id);
  }

  @Get()
  listar(
    @GetUsuario() usuario: UsuarioDocument,
    @Query() dto: ListarCompartidosDto,
  ) {
    return this.manejoPermisos.listar(usuario, dto);
  }

  @Post()
  compartir(
    @GetUsuario() usuario: UsuarioDocument,
    @Body() dto: CompartirRecursoDto,
  ) {
    return this.manejoPermisos.compartir(usuario, dto);
  }

  @Patch('permiso')
  actualizarPermiso(
    @GetUsuario() usuario: UsuarioDocument,
    @Body() dto: ActualizarPermisoDto,
  ) {
    return this.manejoPermisos.actualizarPermiso(usuario, dto);
  }

  @Delete('permiso')
  async revocar(
    @GetUsuario() usuario: UsuarioDocument,
    @Body() dto: RevocarPermisoDto,
  ) {
    await this.manejoPermisos.revocar(usuario, dto);
    return { mensaje: 'permiso revocado' };
  }
}
