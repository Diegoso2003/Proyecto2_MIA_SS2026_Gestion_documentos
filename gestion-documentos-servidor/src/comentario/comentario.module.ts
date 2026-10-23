import { Module } from '@nestjs/common';
import { ComentarioService } from './comentario.service.js';
import { ComentarioController } from './comentario.controller.js';
import { DatabaseModule } from '../database/database.module.js';

@Module({
  imports: [DatabaseModule],
  controllers: [ComentarioController],
  providers: [ComentarioService],
})
export class ComentarioModule {}
