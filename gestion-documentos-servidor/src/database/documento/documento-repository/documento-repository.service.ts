import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Documento, DocumentoDocument } from '../schema/documento.schema.js';
import { Model, Types } from 'mongoose';
import { UsuarioDocument } from '../../usuario/schema/usuario.schema.js';
import { DatosAncestro } from '../../../carpeta/dto/carpeta-elementos-request.dto.js';

@Injectable()
export class DocumentoRepositoryService {
  constructor(
    @InjectModel(Documento.name)
    private readonly documentoModel: Model<DocumentoDocument>,
  ) {}

  async obtenerPorId(id: string) {
    return this.documentoModel.findById(id).select('+contenido');
  }

  async obtenerDocumentosRaiz(usuario: UsuarioDocument) {
    return this.documentoModel.find({
      propietario_id: usuario._id,
      carpeta_id: null,
      fecha_eliminacion: null,
    });
  }

  async obtenerDocumentosPorCarpeta(carpeta_id: string) {
    return this.documentoModel.find({
      carpeta_id: new Types.ObjectId(carpeta_id),
      fecha_eliminacion: null,
    });
  }

  async obtenerDocumentosPapelera(usuario: UsuarioDocument) {
    return this.documentoModel
      .find({
        propietario_id: new Types.ObjectId(usuario._id),
        fecha_eliminacion: { $ne: null },
        eliminado_individual: true,
      })
      .populate<{ ancestros: DatosAncestro[] }>('ancestros', 'nombre');
  }

  async borrarArchivosEnCarpeta(fecha: Date, id: Types.ObjectId) {
    await this.documentoModel.updateMany(
      {
        ancestros: id,
        fecha_eliminacion: null,
      },
      { $set: { fecha_eliminacion: fecha, eliminado_individual: false } },
    );
  }

  async existeDocumentoConNombreEnCarpeta(
    carpetaId: string,
    nombre: string,
    usuarioId: Types.ObjectId,
  ): Promise<boolean> {
    const existente = await this.documentoModel.findOne({
      carpeta_id: new Types.ObjectId(carpetaId),
      propietario_id: usuarioId,
      nombre,
      fecha_eliminacion: null,
    });

    return existente !== null;
  }

  async existeDocumentoRaizConNombre(
    nombre: string,
    usuarioId: Types.ObjectId,
  ): Promise<boolean> {
    const existente = await this.documentoModel.findOne({
      carpeta_id: null,
      propietario_id: usuarioId,
      nombre,
      fecha_eliminacion: null,
    });

    return existente !== null;
  }

  async restaurarArchivosEnCarpeta(carpetaId: Types.ObjectId) {
    await this.documentoModel.updateMany(
      {
        ancestros: carpetaId,
        fecha_eliminacion: { $ne: null },
        eliminado_individual: false,
      },
      { $set: { fecha_eliminacion: null } },
    );
  }

  async actualizar(id: Types.ObjectId, cambios: Partial<DocumentoDocument>) {
    return this.documentoModel.updateOne({ _id: id }, { $set: cambios });
  }

}
