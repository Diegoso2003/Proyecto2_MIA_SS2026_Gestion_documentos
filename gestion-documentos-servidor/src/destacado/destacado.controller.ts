import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DestacadoService } from './destacado.service.js';
import { CreateDestacadoDto } from './dto/create-destacado.dto.js';
import { UpdateDestacadoDto } from './dto/update-destacado.dto.js';

@Controller('destacado')
export class DestacadoController {
  constructor(private readonly destacadoService: DestacadoService) {}

  @Post()
  create(@Body() createDestacadoDto: CreateDestacadoDto) {
    return this.destacadoService.create(createDestacadoDto);
  }

  @Get()
  findAll() {
    return this.destacadoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.destacadoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDestacadoDto: UpdateDestacadoDto) {
    return this.destacadoService.update(+id, updateDestacadoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.destacadoService.remove(+id);
  }
}
