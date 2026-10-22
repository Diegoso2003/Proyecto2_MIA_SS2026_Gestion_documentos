import { Module } from '@nestjs/common';
import { ArchivoService } from './archivo.service.js';
import { ArchivoController } from './archivo.controller.js';

@Module({
  controllers: [ArchivoController],
  providers: [ArchivoService],
})
export class ArchivoModule {}
