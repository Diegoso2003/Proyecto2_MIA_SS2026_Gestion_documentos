import { Module } from '@nestjs/common';
import { DestacadoService } from './destacado.service.js';
import { DestacadoController } from './destacado.controller.js';

@Module({
  controllers: [DestacadoController],
  providers: [DestacadoService],
})
export class DestacadoModule {}
