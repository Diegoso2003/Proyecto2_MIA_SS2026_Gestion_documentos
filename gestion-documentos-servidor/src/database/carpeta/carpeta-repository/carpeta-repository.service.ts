import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Carpeta, CarpetaDocument } from '../schema/carpeta.schema.js';
import { Model } from 'mongoose';
import { UsuarioDocument } from '../../usuario/schema/usuario.schema.js';
import { DatosAncestro } from '../../../carpeta/dto/carpeta-elementos-request.dto.js';

@Injectable()
export class CarpetaRepositoryService {
  constructor(
    @InjectModel(Carpeta.name)
    private readonly carpetaModel: Model<CarpetaDocument>,
  ) {}

  async obtenerCarpetasRaiz(usuario: UsuarioDocument) {
    return this.carpetaModel
      .find({
        propietario_id: usuario._id,
        padre_id: null,
        fecha_eliminacion: null,
      })
      .exec();
  }

  async obtenerCarpeta(padre_id: string) {
    return this.carpetaModel
      .findById(padre_id)
      .populate<{ ancestros: DatosAncestro[] }>('ancestros', 'nombre');
  }

  async obtenerCarpetasHijas(padre_id: string) {
    return this.carpetaModel.find({
      padre_id,
      fecha_eliminacion: null,
    });
  }
}
