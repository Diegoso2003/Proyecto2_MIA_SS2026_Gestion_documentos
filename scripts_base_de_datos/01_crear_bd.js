const baseNueva = db.getSiblingDB("gestion_documentos");

const colecciones = [
  "usuario",
  "carpeta",
  "documento",
  "documento_compartido",
  "comentario",
  "historial",
  "histarial_archivo",
  "documento_destacado",
];

colecciones.forEach((nombre) => {
  if (!baseNueva.getCollectionNames().includes(nombre)) {
    baseNueva.createCollection(nombre);
  }
});

baseNueva.usuario.createIndex({ correo: 1 }, { unique: true });

baseNueva.documento_compartido.createIndex(
  { recurso_id: 1, usuario_destino_id: 1 },
  { unique: true },
);

baseNueva.documento_destacado.createIndex(
  { recurso_id: 1, usuario_destino_id: 1 },
  { unique: true },
);

print("Base 'gestion_documentos' lista:");
printjson(baseNueva.getCollectionNames());
