import { Injectable } from '@nestjs/common';
import { CreateDocumentoDto } from './dto/create-documento.dto.js';
import { UpdateDocumentoDto } from './dto/update-documento.dto.js';
import { RutaCarpetaPadre } from '../carpeta/dto/ruta-carpeta-padre.dto.js';
import { UsuarioDocument } from '../usuario/schema/usuario.schema.js';
import { InjectModel } from '@nestjs/mongoose';
import { Documento, DocumentoDocument } from './schema/documento.schema.js';
import { Model, QueryFilter } from 'mongoose';

@Injectable()
export class DocumentoService {
  constructor(
    @InjectModel(Documento.name)
    private readonly documentoModel: Model<DocumentoDocument>,
  ) {}
  create(createDocumentoDto: CreateDocumentoDto) {
    return 'This action adds a new documento';
  }

  findAll(usuario: UsuarioDocument, padre: RutaCarpetaPadre) {
    const filtros: QueryFilter<DocumentoDocument> = {};
    filtros.propietario_id = usuario._id;
    if (padre.rutaPadre) {
      filtros.carpeta_id = padre.rutaPadre;
    }
    return this.documentoModel.find(filtros).exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} documento`;
  }

  update(id: number, updateDocumentoDto: UpdateDocumentoDto) {
    return `This action updates a #${id} documento`;
  }

  remove(id: number) {
    return `This action removes a #${id} documento`;
  }
}
