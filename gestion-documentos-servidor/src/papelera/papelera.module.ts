import { Module } from '@nestjs/common';
import { PapeleraService } from './papelera.service.js';
import { PapeleraController } from './papelera.controller.js';
import { DatabaseModule } from '../database/database.module.js';

@Module({
  imports: [DatabaseModule],
  providers: [PapeleraService],
  controllers: [PapeleraController],
})
export class PapeleraModule {}
