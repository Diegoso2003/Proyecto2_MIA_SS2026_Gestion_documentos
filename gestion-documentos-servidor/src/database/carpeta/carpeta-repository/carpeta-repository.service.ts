import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Carpeta, CarpetaDocument } from '../schema/carpeta.schema.js';
import { Model, Types } from 'mongoose';
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
      padre_id: new Types.ObjectId(padre_id),
      fecha_eliminacion: null,
    });
  }

  async obtenerCarpetasEnPapelera(usuario: UsuarioDocument) {
    return this.carpetaModel
      .find({
        fecha_eliminacion: { $ne: null },
        propietario_id: usuario._id,
        eliminado_individual: true,
      })
      .populate<{ ancestros: DatosAncestro[] }>('ancestros', 'nombre');
  }

  async borrarSubcarpetas(fecha: Date, id: Types.ObjectId) {
    await this.carpetaModel.updateMany(
      {
        ancestros: id,
        fecha_eliminacion: null,
      },
      { $set: { fecha_eliminacion: fecha, eliminado_individual: false } },
    );
  }

  async obtenerPorId(id: string) {
    return this.carpetaModel.findById(id);
  }

  async existeCarpetaConNombreEnPadre(
    padreId: string,
    nombre: string,
    usuarioId: Types.ObjectId,
  ): Promise<boolean> {
    const existente = await this.carpetaModel.findOne({
      padre_id: new Types.ObjectId(padreId),
      propietario_id: usuarioId,
      nombre,
      fecha_eliminacion: null,
    });

    return existente !== null;
  }

  async existeCarpetaRaizConNombre(
    nombre: string,
    usuarioId: Types.ObjectId,
  ): Promise<boolean> {
    const existente = await this.carpetaModel.findOne({
      padre_id: null,
      propietario_id: usuarioId,
      nombre,
      fecha_eliminacion: null,
    });

    return existente !== null;
  }

  async actualizar(
    id: Types.ObjectId,
    cambios: Partial<CarpetaDocument>,
  ) {
    return this.carpetaModel.updateOne({ _id: id }, { $set: cambios });
  }

  async restaurarSubcarpetas(carpetaId: Types.ObjectId) {
    await this.carpetaModel.updateMany(
      {
        ancestros: carpetaId,
        eliminado_individual: false,
      },
      { $set: { fecha_eliminacion: null } },
    );
  }
}
