import { Module } from '@nestjs/common';
import { CompartidoService } from './compartido.service.js';
import { CompartidoController } from './compartido.controller.js';
import { DatabaseModule } from '../database/database.module.js';
import { ManejoPermisosService } from './manejo-permisos/manejo-permisos.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [CompartidoController],
  providers: [CompartidoService, ManejoPermisosService],
})
export class CompartidoModule {}
