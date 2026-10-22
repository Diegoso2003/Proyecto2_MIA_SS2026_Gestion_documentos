import { Injectable } from '@nestjs/common';
import { CreateDestacadoDto } from './dto/create-destacado.dto.js';
import { UpdateDestacadoDto } from './dto/update-destacado.dto.js';

@Injectable()
export class DestacadoService {
  create(createDestacadoDto: CreateDestacadoDto) {
    return 'This action adds a new destacado';
  }

  findAll() {
    return `This action returns all destacado`;
  }

  findOne(id: number) {
    return `This action returns a #${id} destacado`;
  }

  update(id: number, updateDestacadoDto: UpdateDestacadoDto) {
    return `This action updates a #${id} destacado`;
  }

  remove(id: number) {
    return `This action removes a #${id} destacado`;
  }
}
