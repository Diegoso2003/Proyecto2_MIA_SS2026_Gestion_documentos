import { Module } from '@nestjs/common';
import { CompartidoService } from './compartido.service.js';
import { CompartidoController } from './compartido.controller.js';

@Module({
  controllers: [CompartidoController],
  providers: [CompartidoService],
})
export class CompartidoModule {}
