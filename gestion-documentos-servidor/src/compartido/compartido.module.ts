import { Module } from '@nestjs/common';
import { CompartidoService } from './compartido.service.js';
import { CompartidoController } from './compartido.controller.js';
import { DatabaseModule } from '../database/database.module.js';

@Module({
  imports: [DatabaseModule],
  controllers: [CompartidoController],
  providers: [CompartidoService],
})
export class CompartidoModule {}
