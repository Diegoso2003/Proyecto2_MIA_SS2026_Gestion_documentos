import { Module } from '@nestjs/common';
import { DestacadoService } from './destacado.service.js';
import { DestacadoController } from './destacado.controller.js';
import { DatabaseModule } from '../database/database.module.js';

@Module({
  imports: [DatabaseModule],
  controllers: [DestacadoController],
  providers: [DestacadoService],
})
export class DestacadoModule {}
