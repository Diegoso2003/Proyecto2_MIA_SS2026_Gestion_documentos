import { Injectable } from '@nestjs/common';
import { CreateCarpetaDto } from './dto/create-carpeta.dto.js';
import { UpdateCarpetaDto } from './dto/update-carpeta.dto.js';
import { UsuarioDocument } from '../usuario/schema/usuario.schema.js';
import { RutaCarpetaPadre } from './dto/ruta-carpeta-padre.dto.js';
import { Model, QueryFilter } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Carpeta, CarpetaDocument } from './schema/carpeta.schema.js';

@Injectable()
export class CarpetaService {
  constructor(
    @InjectModel(Carpeta.name)
    private readonly carpetaModel: Model<CarpetaDocument>,
  ) {}
  create(createCarpetaDto: CreateCarpetaDto) {
    return 'This action adds a new carpeta';
  }

  findAll(usuario: UsuarioDocument, padre: RutaCarpetaPadre) {
    const filtro: QueryFilter<CarpetaDocument> = {};
    filtro.propietario_id = usuario._id;
    filtro.padre_id = padre.rutaPadre ? padre.rutaPadre : null;
    filtro.fecha_eliminacion = null;
    return this.carpetaModel.find(filtro).exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} carpeta`;
  }

  update(id: number, updateCarpetaDto: UpdateCarpetaDto) {
    return `This action updates a #${id} carpeta`;
  }

  remove(id: number) {
    return `This action removes a #${id} carpeta`;
  }
}
