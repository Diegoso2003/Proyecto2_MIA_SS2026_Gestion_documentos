import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Carpeta, CarpetaDocument } from '../../database/carpeta/schema/carpeta.schema.js';
import { Model, Types } from 'mongoose';
import { Documento, DocumentoDocument } from '../../database/documento/schema/documento.schema.js';
import { DocumentoCompartido, DocumentoCompartidoDocument } from '../../database/compartido/schema/compartido.schema.js';
import { HistorialArchivo, HistorialArchivoDocument } from '../../database/historial-archivo/schema/historial-archivo.schema.js';
import { UsuarioDocument } from '../../database/usuario/schema/usuario.schema.js';

@Injectable()
export class EliminarDefinitivoService {
  constructor(
    @InjectModel(Carpeta.name)
    private readonly carpetaModel: Model<CarpetaDocument>,

    @InjectModel(Documento.name)
    private readonly documentoModel: Model<DocumentoDocument>,

    @InjectModel(DocumentoCompartido.name)
    private readonly compartidoModel: Model<DocumentoCompartidoDocument>,

    @InjectModel(HistorialArchivo.name)
    private readonly historialArchivoModel: Model<HistorialArchivoDocument>,
  ) {}

  async eliminarCarpetaDefinitivo(
    usuario: UsuarioDocument,
    carpetaId: string,
  ): Promise<void> {
    const carpetaObjectId = new Types.ObjectId(carpetaId);
    const carpeta = await this.carpetaModel.findOne({
      _id: carpetaObjectId,
      propietario_id: usuario._id,
    });

    if (!carpeta) {
      throw new NotFoundException('no se encontró la carpeta');
    }
    const subcarpetas = await this.carpetaModel
      .find({ ancestros: carpetaObjectId })
      .select('_id')
      .lean();
    const documentos = await this.documentoModel
      .find({ ancestros: carpetaObjectId })
      .select('_id')
      .lean();
    const idsCarpetas: Types.ObjectId[] = [
      carpetaObjectId,
      ...subcarpetas.map((c) => c._id as Types.ObjectId),
    ];
    const idsDocumentos: Types.ObjectId[] = documentos.map(
      (d) => d._id as Types.ObjectId,
    );
    await this.limpiarReferencias(idsDocumentos, idsCarpetas);
    await this.documentoModel.deleteMany({ ancestros: carpetaObjectId });
    await this.carpetaModel.deleteMany({ ancestros: carpetaObjectId });
    await this.carpetaModel.deleteOne({ _id: carpetaObjectId });
  }
  async eliminarDocumentoDefinitivo(
    usuario: UsuarioDocument,
    documentoId: string,
  ): Promise<void> {
    const documentoObjectId = new Types.ObjectId(documentoId);
    const documento = await this.documentoModel.findOne({
      _id: documentoObjectId,
      propietario_id: usuario._id,
    });
    if (!documento) {
      throw new NotFoundException('no se encontró el documento');
    }
    await this.limpiarReferencias([documentoObjectId], []);
    await this.documentoModel.deleteOne({ _id: documentoObjectId });
  }

  private async limpiarReferencias(
    documentoIds: Types.ObjectId[],
    carpetaIds: Types.ObjectId[],
  ): Promise<void> {
    const filtrosCompartido: Record<string, any>[] = [];
    if (documentoIds.length > 0) {
      filtrosCompartido.push({
        recurso_tipo: 'archivo',
        recurso_id: { $in: documentoIds },
      });
    }
    if (carpetaIds.length > 0) {
      filtrosCompartido.push({
        recurso_tipo: 'carpeta',
        recurso_id: { $in: carpetaIds },
      });
    }
    if (filtrosCompartido.length > 0) {
      await this.compartidoModel.deleteMany({ $or: filtrosCompartido });
    }
    if (documentoIds.length > 0) {
      await this.historialArchivoModel.deleteMany({
        documento_id: { $in: documentoIds },
      });
    }
  }
}
