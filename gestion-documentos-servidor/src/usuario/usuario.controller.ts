import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service.js';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import { Roles } from '../decorators/roles/roles.decorator.js';
import { Rol } from './Rol.js';
import { UpdateUsuarioEstadoDTO } from './dto/update-usuario-estado.dto.js';
import { UpdateUsuarioPassword } from './dto/update-usuario-password.dto.js';
import { UsuarioFiltroDto } from './dto/usuario-filtro.dto.js';

@Roles(Rol.ADMIN)
@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  async create(@Body() createUsuarioDto: CreateUsuarioDto) {
    await this.usuarioService.create(createUsuarioDto);
  }

  @Get()
  findAll(@Query() filtros: UsuarioFiltroDto) {
    return this.usuarioService.findAll(filtros);
  }

  @Patch('estado/:id')
  async updateEstado(
    @Param('id') id: string,
    @Body() estadoUsuario: UpdateUsuarioEstadoDTO,
  ) {
    await this.usuarioService.updateEstado(id, estadoUsuario);
  }

  @Patch('actu-password/:id')
  async updatePassword(
    @Param('id') id: string,
    @Body() nuevaContra: UpdateUsuarioPassword,
  ) {
    await this.usuarioService.updatePassword(id, nuevaContra);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    await this.usuarioService.update(id, updateUsuarioDto);
  }
}
