import { Controller, Get } from '@nestjs/common';
import { GetUsuario } from '../decorators/get-usuario/get-usuario.decorator.js';
import type { UsuarioDocument } from '../database/usuario/schema/usuario.schema.js';
import { PapeleraService } from './papelera.service.js';

@Controller('papelera')
export class PapeleraController {
  constructor(private readonly papeleraService: PapeleraService) {}
  @Get()
  async obtenerPapelera(@GetUsuario() usuario: UsuarioDocument) {
    return await this.papeleraService.obtenerPapeleraUsuario(usuario);
  }
}
