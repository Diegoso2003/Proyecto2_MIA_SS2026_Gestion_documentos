import { Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { GetUsuario } from '../decorators/get-usuario/get-usuario.decorator.js';
import type { UsuarioDocument } from '../database/usuario/schema/usuario.schema.js';
import { PapeleraService } from './papelera.service.js';
import { EliminarDefinitivoService } from './eliminar-definitivo/eliminar-definitivo.service.js';

@Controller('papelera')
export class PapeleraController {
  constructor(
    private readonly papeleraService: PapeleraService,
    private readonly eliminarDefinitivo: EliminarDefinitivoService,
  ) {}
  @Get()
  async obtenerPapelera(@GetUsuario() usuario: UsuarioDocument) {
    return await this.papeleraService.obtenerPapeleraUsuario(usuario);
  }

  @Patch('restaurar-carpeta/:id')
  async restaurarCarpeta(
    @GetUsuario() usuario: UsuarioDocument,
    @Param('id') id: string,
  ) {
    return await this.papeleraService.restaurarCarpeta(usuario, id);
  }

  @Patch('restaurar-archivo/:id')
  async restaurarArchivo(
    @GetUsuario() usuario: UsuarioDocument,
    @Param('id') id: string,
  ) {
    return await this.papeleraService.restaurarDocumento(usuario, id);
  }

  @Delete('carpeta/:id')
  async eliminarCarpeta(
    @GetUsuario() usuario: UsuarioDocument,
    @Param('id') id: string,
  ) {
    await this.eliminarDefinitivo.eliminarCarpetaDefinitivo(usuario, id);
    return { mensaje: 'carpeta eliminada definitivamente' };
  }

  @Delete('documento/:id')
  async eliminarDocumento(
    @GetUsuario() usuario: UsuarioDocument,
    @Param('id') id: string,
  ) {
    await this.eliminarDefinitivo.eliminarDocumentoDefinitivo(usuario, id);
    return { mensaje: 'documento eliminado definitivamente' };
  }
}
