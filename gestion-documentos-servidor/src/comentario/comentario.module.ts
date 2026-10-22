import { Module } from '@nestjs/common';
import { ComentarioService } from './comentario.service.js';
import { ComentarioController } from './comentario.controller.js';

@Module({
  controllers: [ComentarioController],
  providers: [ComentarioService],
})
export class ComentarioModule {}
