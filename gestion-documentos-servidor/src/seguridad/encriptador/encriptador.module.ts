import { Module } from '@nestjs/common';
import { EncriptadorService } from './encriptador.service.js';

@Module({
    providers: [EncriptadorService],
    exports: [EncriptadorService]
})
export class EncriptadorModule {}
