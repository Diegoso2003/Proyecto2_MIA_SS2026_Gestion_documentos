import { Injectable } from '@nestjs/common';
import { CreateCompartidoDto } from './dto/create-compartido.dto.js';
import { UpdateCompartidoDto } from './dto/update-compartido.dto.js';

@Injectable()
export class CompartidoService {
  create(createCompartidoDto: CreateCompartidoDto) {
    return 'This action adds a new compartido';
  }

  findAll() {
    return `This action returns all compartido`;
  }

  findOne(id: number) {
    return `This action returns a #${id} compartido`;
  }

  update(id: number, updateCompartidoDto: UpdateCompartidoDto) {
    return `This action updates a #${id} compartido`;
  }

  remove(id: number) {
    return `This action removes a #${id} compartido`;
  }
}
