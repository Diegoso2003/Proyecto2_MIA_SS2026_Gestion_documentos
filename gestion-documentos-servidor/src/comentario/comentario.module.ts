import { Module } from '@nestjs/common';
import { ComentarioService } from './comentario.service.js';
import { ComentarioController } from './comentario.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Comentario, ComentarioSchema } from './schema/comentario.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comentario.name, schema: ComentarioSchema },
    ]),
  ],
  controllers: [ComentarioController],
  providers: [ComentarioService],
  exports: [MongooseModule],
})
export class ComentarioModule {}
