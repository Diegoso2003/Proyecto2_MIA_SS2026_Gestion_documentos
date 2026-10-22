const bd = db.getSiblingDB("gestion_documentos");

if (bd.usuario.countDocuments() > 0) {
  throw new Error(
    "La base ya tiene datos. Para recargar: db.getSiblingDB('gestion_documentos').dropDatabase() y vuelve a correr 01_crear_bd.js",
  );
}

const mismoId = (a, b) => a.toString() === b.toString();

const historial = [];
function registrar(usuario, accion, descripcion, cuando) {
  historial.push({
    usuario_id: usuario._id,
    accion,
    descripcion,
    createdAt: cuando,
  });
}

function crearUsuario(nombre, correo, rol, contraseña_hash) {
  return {
    _id: new ObjectId(),
    nombre,
    correo,
    contraseña_hash,
    rol,
    activo: true,
  };
}
const ana = crearUsuario(
  "Ana Morales",
  "ana_morales@gmail.com",
  "administrador",
  "$argon2id$v=19$m=65536,t=3,p=4$i3g2sFThZUopb1I50fa74A$ehE0XaZdcHj2vpenaH8iMdXHol6oxFxKtutGvVog5eA",
);
const luis = crearUsuario(
  "Luis Pérez",
  "luis_perez@gmail.com",
  "usuario",
  "$argon2id$v=19$m=65536,t=3,p=4$alO6eg7uZN3ZnjILyVLV4w$YM1Cw2fwOkkILw2x79zSQe3dNsMiQCKQ9JcwpSTSHIg",
);
const maria = crearUsuario(
  "María López",
  "maria_lopez@gmail.com",
  "usuario",
  "$argon2id$v=19$m=65536,t=3,p=4$dLGS0oSRBTtjqQ0oRT36OQ$hjl47NTcHQnpVej0+URqAYuZf+hnaJGR8VQogQXj9zc",
);
const usuarios = [ana, luis, maria];
const dueñoDe = (id) => usuarios.find((u) => mismoId(u._id, id));

const carpetas = [];
const carpetaPorId = (id) => carpetas.find((c) => mismoId(c._id, id));

function crearCarpeta(nombre, dueño, padre, creada) {
  const carpeta = {
    _id: new ObjectId(),
    nombre,
    propietario_id: dueño._id,
    padre_id: padre ? padre._id : null,
    ancestros: padre ? [...padre.ancestros, padre._id] : [],
    fecha_eliminacion: null,
    createdAt: creada,
    updatedAt: creada,
  };
  carpetas.push(carpeta);
  registrar(
    dueño,
    "crear_carpeta",
    padre
      ? `Creó la carpeta «${nombre}» dentro de «${padre.nombre}»`
      : `Creó la carpeta «${nombre}» en la raíz`,
    creada,
  );
  return carpeta;
}

const administracion = crearCarpeta(
  "Administración",
  ana,
  null,
  ISODate("2026-04-17T09:00:00Z"),
);
const contratos = crearCarpeta(
  "Contratos",
  ana,
  administracion,
  ISODate("2026-04-17T09:10:00Z"),
);
const informes = crearCarpeta(
  "Informes",
  ana,
  administracion,
  ISODate("2026-04-17T09:20:00Z"),
);
const politicas = crearCarpeta(
  "Políticas",
  ana,
  null,
  ISODate("2026-04-17T09:30:00Z"),
);
const proyectos = crearCarpeta(
  "Proyectos",
  luis,
  null,
  ISODate("2026-04-17T10:00:00Z"),
);
const alpha = crearCarpeta(
  "Alpha",
  luis,
  proyectos,
  ISODate("2026-04-17T10:10:00Z"),
);
const beta = crearCarpeta(
  "Beta",
  luis,
  proyectos,
  ISODate("2026-04-17T10:20:00Z"),
);
const documentacion = crearCarpeta(
  "Documentación",
  luis,
  alpha,
  ISODate("2026-04-17T10:30:00Z"),
);
const notas = crearCarpeta(
  "Notas",
  luis,
  null,
  ISODate("2026-04-17T10:40:00Z"),
);
const finanzas = crearCarpeta(
  "Finanzas",
  maria,
  null,
  ISODate("2026-04-17T11:00:00Z"),
);
const f2025 = crearCarpeta(
  "2025",
  maria,
  finanzas,
  ISODate("2026-04-17T11:10:00Z"),
);
const f2026 = crearCarpeta(
  "2026",
  maria,
  finanzas,
  ISODate("2026-04-17T11:20:00Z"),
);
const personal = crearCarpeta(
  "Personal",
  maria,
  null,
  ISODate("2026-04-17T11:30:00Z"),
);

const documentos = [];

const archivo = (nombre) => {
  const documento = documentos.find((d) => d.nombre === nombre);
  if (!documento) throw new Error(`No existe el archivo «${nombre}»`);
  return documento;
};

function contenidoDe(nombre, dueño, extension) {
  const titulo = nombre.replace(/\.[^.]+$/, "").replace(/_/g, " ");
  return extension === "md"
    ? `# ${titulo}\n\nAutor: ${dueño.nombre}\n\n- Documento de ejemplo para pruebas.\n- Archivo: ${nombre}\n- Texto en español: ñandú, canción, año.\n`
    : `${titulo}\nAutor: ${dueño.nombre}\n\nDocumento de ejemplo para pruebas.\nArchivo: ${nombre}\nTexto en español: ñandú, canción, año.\n`;
}

function crearArchivo(nombre, dueño, carpeta, creado) {
  const extension = nombre.split(".").pop();
  const tipo_mime = extension === "md" ? "text/markdown" : "text/plain";

  const documento = {
    _id: new ObjectId(),
    nombre,
    propietario_id: dueño._id,
    carpeta_id: carpeta ? carpeta._id : null,
    detalles: { extension, tipo_mime },
    contenido: contenidoDe(nombre, dueño, extension),
    fecha_eliminacion: null,
    createdAt: creado,
    updatedAt: creado,
  };
  documentos.push(documento);
  registrar(
    dueño,
    "subir",
    `Subió el archivo «${nombre}» a ${carpeta ? `la carpeta «${carpeta.nombre}»` : "la raíz"}`,
    creado,
  );
}

crearArchivo(
  "contrato_marco_proveedores.txt",
  ana,
  contratos,
  ISODate("2026-04-20T09:15:00Z"),
);
crearArchivo(
  "calendario_actividades_2026.txt",
  ana,
  null,
  ISODate("2026-04-23T12:00:00Z"),
);
crearArchivo(
  "informe_trimestral_q1.md",
  ana,
  informes,
  ISODate("2026-05-06T16:20:00Z"),
);
crearArchivo(
  "acuerdo_confidencialidad.md",
  ana,
  contratos,
  ISODate("2026-05-11T14:30:00Z"),
);
crearArchivo(
  "politica_seguridad_informacion.md",
  ana,
  politicas,
  ISODate("2026-05-20T09:45:00Z"),
);
crearArchivo(
  "contrato_arrendamiento_oficina.txt",
  ana,
  contratos,
  ISODate("2026-06-02T10:05:00Z"),
);
crearArchivo(
  "manual_induccion_empleados.md",
  ana,
  administracion,
  ISODate("2026-06-15T08:50:00Z"),
);
crearArchivo(
  "politica_teletrabajo.txt",
  ana,
  politicas,
  ISODate("2026-06-24T13:25:00Z"),
);
crearArchivo(
  "acta_reunion_directiva_junio.txt",
  ana,
  administracion,
  ISODate("2026-06-30T17:00:00Z"),
);
crearArchivo(
  "informe_trimestral_q2.md",
  ana,
  informes,
  ISODate("2026-07-08T11:40:00Z"),
);
crearArchivo(
  "directorio_proveedores.md",
  ana,
  null,
  ISODate("2026-08-05T09:20:00Z"),
);
crearArchivo(
  "informe_auditoria_interna.txt",
  ana,
  informes,
  ISODate("2026-08-19T15:10:00Z"),
);
crearArchivo(
  "politica_gastos_viaje.txt",
  ana,
  politicas,
  ISODate("2026-09-03T10:30:00Z"),
);
crearArchivo(
  "acta_reunion_directiva_septiembre.txt",
  ana,
  administracion,
  ISODate("2026-09-22T16:15:00Z"),
);
crearArchivo(
  "resumen_gestion_semestral.md",
  ana,
  administracion,
  ISODate("2026-10-07T11:10:00Z"),
);

crearArchivo(
  "propuesta_proyecto_alpha.md",
  luis,
  alpha,
  ISODate("2026-04-22T10:40:00Z"),
);
crearArchivo(
  "minuta_kickoff_alpha.txt",
  luis,
  proyectos,
  ISODate("2026-04-24T17:20:00Z"),
);
crearArchivo(
  "cronograma_proyectos.txt",
  luis,
  proyectos,
  ISODate("2026-05-02T08:40:00Z"),
);
crearArchivo(
  "requerimientos_alpha.txt",
  luis,
  alpha,
  ISODate("2026-05-08T15:55:00Z"),
);
crearArchivo(
  "propuesta_proyecto_beta.md",
  luis,
  beta,
  ISODate("2026-05-14T11:25:00Z"),
);
crearArchivo(
  "ideas_reunion_semanal.txt",
  luis,
  notas,
  ISODate("2026-05-22T10:10:00Z"),
);
crearArchivo(
  "arquitectura_alpha.md",
  luis,
  documentacion,
  ISODate("2026-05-27T09:35:00Z"),
);
crearArchivo(
  "requerimientos_beta.txt",
  luis,
  beta,
  ISODate("2026-06-05T09:00:00Z"),
);
crearArchivo(
  "manual_usuario_alpha.md",
  luis,
  documentacion,
  ISODate("2026-06-12T14:05:00Z"),
);
crearArchivo(
  "presupuesto_proyectos.md",
  luis,
  proyectos,
  ISODate("2026-06-19T12:15:00Z"),
);
crearArchivo(
  "guia_instalacion_alpha.txt",
  luis,
  documentacion,
  ISODate("2026-07-02T10:20:00Z"),
);
crearArchivo(
  "plan_pruebas_beta.txt",
  luis,
  beta,
  ISODate("2026-07-16T13:50:00Z"),
);
crearArchivo(
  "notas_capacitacion_mongodb.md",
  luis,
  notas,
  ISODate("2026-07-23T09:55:00Z"),
);
crearArchivo(
  "bitacora_alpha_julio.txt",
  luis,
  alpha,
  ISODate("2026-07-29T16:45:00Z"),
);
crearArchivo(
  "borrador_presentacion_cliente.md",
  luis,
  null,
  ISODate("2026-08-12T11:00:00Z"),
);
crearArchivo(
  "informe_avance_beta.md",
  luis,
  beta,
  ISODate("2026-08-27T15:30:00Z"),
);
crearArchivo(
  "pendientes_septiembre.txt",
  luis,
  notas,
  ISODate("2026-09-01T08:35:00Z"),
);
crearArchivo(
  "lecciones_aprendidas.md",
  luis,
  notas,
  ISODate("2026-09-17T14:40:00Z"),
);
crearArchivo(
  "resumen_diseño_proyectos_2026.txt",
  luis,
  null,
  ISODate("2026-10-02T15:00:00Z"),
);
crearArchivo(
  "checklist_entrega_final.txt",
  luis,
  proyectos,
  ISODate("2026-10-12T10:25:00Z"),
);

crearArchivo(
  "presupuesto_anual_2026.md",
  maria,
  f2026,
  ISODate("2026-04-21T09:30:00Z"),
);
crearArchivo(
  "balance_general_2025.md",
  maria,
  f2025,
  ISODate("2026-05-04T09:05:00Z"),
);
crearArchivo(
  "flujo_caja_enero.txt",
  maria,
  f2026,
  ISODate("2026-05-18T14:15:00Z"),
);
crearArchivo(
  "estado_resultados_2025.txt",
  maria,
  f2025,
  ISODate("2026-05-25T13:40:00Z"),
);
crearArchivo(
  "metas_personales.md",
  maria,
  personal,
  ISODate("2026-05-31T18:10:00Z"),
);
crearArchivo(
  "flujo_caja_febrero.txt",
  maria,
  f2026,
  ISODate("2026-06-08T10:50:00Z"),
);
crearArchivo(
  "politica_cobranza.txt",
  maria,
  finanzas,
  ISODate("2026-06-17T12:30:00Z"),
);
crearArchivo(
  "conciliacion_bancaria_mayo.txt",
  maria,
  f2026,
  ISODate("2026-06-29T16:05:00Z"),
);
crearArchivo(
  "cierre_contable_2025.txt",
  maria,
  f2025,
  ISODate("2026-07-06T15:20:00Z"),
);
crearArchivo(
  "informe_impuestos_2025.md",
  maria,
  f2025,
  ISODate("2026-07-21T10:00:00Z"),
);
crearArchivo(
  "proyeccion_ingresos_2026.md",
  maria,
  f2026,
  ISODate("2026-08-10T11:35:00Z"),
);
crearArchivo(
  "ideas_capacitacion.txt",
  maria,
  personal,
  ISODate("2026-08-24T17:30:00Z"),
);
crearArchivo(
  "resumen_gastos_trimestre.md",
  maria,
  finanzas,
  ISODate("2026-09-09T14:55:00Z"),
);
crearArchivo(
  "lista_facturas_pendientes.txt",
  maria,
  finanzas,
  ISODate("2026-09-28T09:40:00Z"),
);
crearArchivo(
  "plan_vacaciones.txt",
  maria,
  personal,
  ISODate("2026-10-09T12:45:00Z"),
);

const compartidos = [];
const textoPermiso = {
  lectura: "lectura",
  edicion: "edicion",
  comentar: "comentar",
};

function compartir(recurso, tipo, dueño, destino, permiso, cuando) {
  const compartido = {
    _id: new ObjectId(),
    recurso_tipo: tipo,
    recurso_id: recurso._id,
    propietario_id: dueño._id,
    usuario_destino_id: destino._id,
    permiso,
    createdAt: cuando,
    updatedAt: cuando,
  };
  compartidos.push(compartido);
  registrar(
    dueño,
    "compartir",
    `Compartió ${tipo === "carpeta" ? "la carpeta" : "el archivo"} «${recurso.nombre}» con ${destino.nombre} (permiso: ${textoPermiso[permiso]})`,
    cuando,
  );
  return { compartido, recurso, tipo, dueño, destino };
}
const compartirArchivo = (nombre, dueño, destino, permiso, cuando) =>
  compartir(archivo(nombre), "archivo", dueño, destino, permiso, cuando);

compartir(
  contratos,
  "carpeta",
  ana,
  luis,
  "lectura",
  ISODate("2026-04-18T10:00:00Z"),
);
compartir(
  proyectos,
  "carpeta",
  luis,
  maria,
  "edicion",
  ISODate("2026-04-18T11:00:00Z"),
);
compartir(
  finanzas,
  "carpeta",
  maria,
  ana,
  "comentar",
  ISODate("2026-04-18T12:00:00Z"),
);

compartirArchivo(
  "contrato_marco_proveedores.txt",
  ana,
  luis,
  "lectura",
  ISODate("2026-04-21T11:00:00Z"),
);
compartirArchivo(
  "contrato_marco_proveedores.txt",
  ana,
  maria,
  "comentar",
  ISODate("2026-04-21T11:05:00Z"),
);
compartirArchivo(
  "informe_trimestral_q1.md",
  ana,
  maria,
  "lectura",
  ISODate("2026-05-07T10:00:00Z"),
);
compartirArchivo(
  "acuerdo_confidencialidad.md",
  ana,
  luis,
  "comentar",
  ISODate("2026-05-12T09:30:00Z"),
);
compartirArchivo(
  "politica_seguridad_informacion.md",
  ana,
  luis,
  "lectura",
  ISODate("2026-05-21T08:00:00Z"),
);
compartirArchivo(
  "politica_seguridad_informacion.md",
  ana,
  maria,
  "lectura",
  ISODate("2026-05-21T08:05:00Z"),
);
compartirArchivo(
  "manual_induccion_empleados.md",
  ana,
  maria,
  "edicion",
  ISODate("2026-06-16T09:00:00Z"),
);
compartirArchivo(
  "acta_reunion_directiva_junio.txt",
  ana,
  luis,
  "comentar",
  ISODate("2026-07-01T10:00:00Z"),
);
compartirArchivo(
  "informe_trimestral_q2.md",
  ana,
  luis,
  "lectura",
  ISODate("2026-07-09T09:00:00Z"),
);

compartirArchivo(
  "propuesta_proyecto_alpha.md",
  luis,
  ana,
  "lectura",
  ISODate("2026-04-23T09:00:00Z"),
);
compartirArchivo(
  "propuesta_proyecto_alpha.md",
  luis,
  maria,
  "comentar",
  ISODate("2026-04-23T09:05:00Z"),
);
const cronogramaAna = compartirArchivo(
  "cronograma_proyectos.txt",
  luis,
  ana,
  "edicion",
  ISODate("2026-05-03T09:00:00Z"),
);
compartirArchivo(
  "cronograma_proyectos.txt",
  luis,
  maria,
  "lectura",
  ISODate("2026-05-03T09:05:00Z"),
);
compartirArchivo(
  "arquitectura_alpha.md",
  luis,
  ana,
  "comentar",
  ISODate("2026-05-28T10:00:00Z"),
);
compartirArchivo(
  "manual_usuario_alpha.md",
  luis,
  maria,
  "lectura",
  ISODate("2026-06-13T09:30:00Z"),
);
compartirArchivo(
  "presupuesto_proyectos.md",
  luis,
  maria,
  "comentar",
  ISODate("2026-06-20T10:30:00Z"),
);
compartirArchivo(
  "guia_instalacion_alpha.txt",
  luis,
  ana,
  "lectura",
  ISODate("2026-07-03T11:00:00Z"),
);
compartirArchivo(
  "notas_capacitacion_mongodb.md",
  luis,
  ana,
  "lectura",
  ISODate("2026-07-24T10:00:00Z"),
);

compartirArchivo(
  "presupuesto_anual_2026.md",
  maria,
  ana,
  "lectura",
  ISODate("2026-04-22T10:00:00Z"),
);
compartirArchivo(
  "presupuesto_anual_2026.md",
  maria,
  luis,
  "comentar",
  ISODate("2026-04-22T10:05:00Z"),
);
compartirArchivo(
  "flujo_caja_enero.txt",
  maria,
  ana,
  "comentar",
  ISODate("2026-05-19T09:00:00Z"),
);
compartirArchivo(
  "politica_cobranza.txt",
  maria,
  luis,
  "lectura",
  ISODate("2026-06-18T09:30:00Z"),
);
compartirArchivo(
  "proyeccion_ingresos_2026.md",
  maria,
  ana,
  "edicion",
  ISODate("2026-08-11T09:00:00Z"),
);
compartirArchivo(
  "resumen_gastos_trimestre.md",
  maria,
  luis,
  "lectura",
  ISODate("2026-09-10T10:00:00Z"),
);

function cambiarPermiso(registro, permisoNuevo, cuando) {
  const anterior = registro.compartido.permiso;
  registro.compartido.permiso = permisoNuevo;
  registro.compartido.updatedAt = cuando;
  registrar(
    registro.dueño,
    "modificar_permiso",
    `Cambió el permiso de ${registro.destino.nombre} sobre «${registro.recurso.nombre}» de ${textoPermiso[anterior]} a ${textoPermiso[permisoNuevo]}`,
    cuando,
  );
}
cambiarPermiso(cronogramaAna, "lectura", ISODate("2026-09-12T14:00:00Z"));

function revocar(registro, cuando) {
  compartidos.splice(compartidos.indexOf(registro.compartido), 1);
  registrar(
    registro.dueño,
    "revocar_permiso",
    `Retiró el acceso de ${registro.destino.nombre} al archivo «${registro.recurso.nombre}»`,
    cuando,
  );
}
const temporal = compartirArchivo(
  "notas_capacitacion_mongodb.md",
  luis,
  maria,
  "lectura",
  ISODate("2026-07-24T10:10:00Z"),
);
revocar(temporal, ISODate("2026-08-03T09:00:00Z"));

const comentarios = [];
function comentar(usuario, nombreArchivo, texto, cuando) {
  const documento = archivo(nombreArchivo);
  comentarios.push({
    _id: new ObjectId(),
    documento_id: documento._id,
    usuario_id: usuario._id,
    texto,
    createdAt: cuando,
    updatedAt: cuando,
  });
  registrar(
    usuario,
    "comentar",
    `Comentó en el archivo «${nombreArchivo}»`,
    cuando,
  );
}
comentar(
  maria,
  "contrato_marco_proveedores.txt",
  "Revisé las cláusulas de pago, todo en orden.",
  ISODate("2026-04-22T09:00:00Z"),
);
comentar(
  ana,
  "contrato_marco_proveedores.txt",
  "Gracias, quedo atenta a más observaciones.",
  ISODate("2026-04-22T10:30:00Z"),
);
comentar(
  luis,
  "presupuesto_anual_2026.md",
  "Aprobado de mi parte.",
  ISODate("2026-04-23T15:00:00Z"),
);
comentar(
  maria,
  "propuesta_proyecto_alpha.md",
  "¿Podemos confirmar el alcance antes del kickoff?",
  ISODate("2026-04-24T08:45:00Z"),
);
comentar(
  luis,
  "propuesta_proyecto_alpha.md",
  "Sí, lo revisamos en la reunión del jueves.",
  ISODate("2026-04-24T10:00:00Z"),
);
comentar(
  luis,
  "acuerdo_confidencialidad.md",
  "Falta definir la vigencia del acuerdo.",
  ISODate("2026-05-13T10:00:00Z"),
);
comentar(
  ana,
  "acuerdo_confidencialidad.md",
  "Lo agrego hoy mismo.",
  ISODate("2026-05-13T11:15:00Z"),
);
comentar(
  ana,
  "flujo_caja_enero.txt",
  "Confirmar la cifra de ingresos de la semana 3.",
  ISODate("2026-05-20T10:30:00Z"),
);
comentar(
  ana,
  "arquitectura_alpha.md",
  "Sugiero documentar también el diagrama de despliegue.",
  ISODate("2026-05-29T14:00:00Z"),
);
comentar(
  maria,
  "presupuesto_proyectos.md",
  "Los montos del segundo trimestre no coinciden con finanzas.",
  ISODate("2026-06-21T09:20:00Z"),
);
comentar(
  luis,
  "presupuesto_proyectos.md",
  "Gracias, los corrijo.",
  ISODate("2026-06-21T11:00:00Z"),
);
comentar(
  luis,
  "acta_reunion_directiva_junio.txt",
  "Hay un acuerdo repetido en el punto 4.",
  ISODate("2026-07-02T09:30:00Z"),
);

function descargar(usuario, nombreArchivo, cuando) {
  archivo(nombreArchivo);
  registrar(
    usuario,
    "descargar",
    `Descargó el archivo «${nombreArchivo}»`,
    cuando,
  );
}
descargar(
  ana,
  "contrato_marco_proveedores.txt",
  ISODate("2026-04-22T09:10:00Z"),
);
descargar(
  maria,
  "propuesta_proyecto_alpha.md",
  ISODate("2026-04-24T08:30:00Z"),
);
descargar(ana, "presupuesto_anual_2026.md", ISODate("2026-04-23T08:50:00Z"));
descargar(
  luis,
  "contrato_marco_proveedores.txt",
  ISODate("2026-04-25T11:20:00Z"),
);
descargar(luis, "propuesta_proyecto_alpha.md", ISODate("2026-04-25T09:00:00Z"));
descargar(
  maria,
  "contrato_marco_proveedores.txt",
  ISODate("2026-04-26T14:00:00Z"),
);
descargar(ana, "propuesta_proyecto_alpha.md", ISODate("2026-04-27T12:00:00Z"));
descargar(
  ana,
  "contrato_marco_proveedores.txt",
  ISODate("2026-05-15T10:00:00Z"),
);
descargar(
  luis,
  "politica_seguridad_informacion.md",
  ISODate("2026-05-22T09:30:00Z"),
);
descargar(
  maria,
  "politica_seguridad_informacion.md",
  ISODate("2026-05-26T13:00:00Z"),
);
descargar(luis, "propuesta_proyecto_alpha.md", ISODate("2026-05-30T10:30:00Z"));
descargar(maria, "presupuesto_anual_2026.md", ISODate("2026-06-01T09:15:00Z"));
descargar(luis, "manual_usuario_alpha.md", ISODate("2026-06-14T11:15:00Z"));
descargar(maria, "manual_usuario_alpha.md", ISODate("2026-06-14T15:40:00Z"));
descargar(
  ana,
  "contrato_marco_proveedores.txt",
  ISODate("2026-07-01T16:30:00Z"),
);

// ---------- Renombrar y mover ----------
function renombrar(nombreActual, nombreNuevo, cuando) {
  const documento = archivo(nombreActual);
  documento.nombre = nombreNuevo;
  documento.updatedAt = cuando;
  registrar(
    dueñoDe(documento.propietario_id),
    "renombrar",
    `Renombró el archivo «${nombreActual}» a «${nombreNuevo}»`,
    cuando,
  );
}
renombrar(
  "directorio_proveedores.md",
  "directorio_proveedores_2026.md",
  ISODate("2026-08-20T09:50:00Z"),
);
renombrar(
  "metas_personales.md",
  "metas_personales_2026.md",
  ISODate("2026-09-30T10:00:00Z"),
);

function moverArchivo(nombre, destino, cuando) {
  const documento = archivo(nombre);
  const origen = carpetaPorId(documento.carpeta_id);
  documento.carpeta_id = destino._id;
  documento.updatedAt = cuando;
  registrar(
    dueñoDe(documento.propietario_id),
    "mover",
    `Movió el archivo «${nombre}» de la carpeta «${origen.nombre}» a la carpeta «${destino.nombre}»`,
    cuando,
  );
}
moverArchivo(
  "requerimientos_alpha.txt",
  documentacion,
  ISODate("2026-06-25T10:00:00Z"),
);
moverArchivo(
  "lista_facturas_pendientes.txt",
  f2026,
  ISODate("2026-10-01T14:00:00Z"),
);

function archivoAPapelera(nombre, cuando) {
  const documento = archivo(nombre);
  documento.fecha_eliminacion = cuando;
  documento.updatedAt = cuando;
  registrar(
    dueñoDe(documento.propietario_id),
    "eliminar",
    `Envió a la papelera el archivo «${nombre}»`,
    cuando,
  );
}

function restaurarArchivo(nombre, cuando) {
  const documento = archivo(nombre);
  documento.fecha_eliminacion = null;
  documento.updatedAt = cuando;
  registrar(
    dueñoDe(documento.propietario_id),
    "restaurar",
    `Restauró el archivo «${nombre}» desde la papelera`,
    cuando,
  );
}

function carpetaAPapelera(raiz, cuando) {
  const subarbol = carpetas.filter(
    (c) =>
      mismoId(c._id, raiz._id) || c.ancestros.some((a) => mismoId(a, raiz._id)),
  );
  const idsCarpetas = subarbol.map((c) => c._id.toString());
  subarbol.forEach((c) => {
    c.fecha_eliminacion = cuando;
    c.updatedAt = cuando;
  });
  const archivos = documentos.filter(
    (d) =>
      d.carpeta_id &&
      idsCarpetas.includes(d.carpeta_id.toString()) &&
      d.fecha_eliminacion === null,
  );
  archivos.forEach((d) => {
    d.fecha_eliminacion = cuando;
    d.updatedAt = cuando;
  });
  registrar(
    dueñoDe(raiz.propietario_id),
    "eliminar",
    `Envió a la papelera la carpeta «${raiz.nombre}» (${archivos.length} archivos y ${subarbol.length - 1} subcarpetas)`,
    cuando,
  );
}

archivoAPapelera("ideas_reunion_semanal.txt", ISODate("2026-06-02T16:00:00Z"));
archivoAPapelera(
  "conciliacion_bancaria_mayo.txt",
  ISODate("2026-07-15T09:05:00Z"),
);
archivoAPapelera("bitacora_alpha_julio.txt", ISODate("2026-08-30T09:30:00Z"));
archivoAPapelera(
  "informe_auditoria_interna.txt",
  ISODate("2026-09-10T10:00:00Z"),
);
archivoAPapelera("ideas_capacitacion.txt", ISODate("2026-09-15T11:20:00Z"));
carpetaAPapelera(beta, ISODate("2026-10-08T09:00:00Z"));
carpetaAPapelera(f2025, ISODate("2026-10-10T10:30:00Z"));
archivoAPapelera("politica_gastos_viaje.txt", ISODate("2026-09-20T10:00:00Z"));
restaurarArchivo("politica_gastos_viaje.txt", ISODate("2026-09-21T09:00:00Z"));

registrar(
  luis,
  "subir",
  "Subió el archivo «borrador_descartado.txt» a la carpeta «Notas»",
  ISODate("2026-06-26T10:00:00Z"),
);
registrar(
  luis,
  "eliminar",
  "Envió a la papelera el archivo «borrador_descartado.txt»",
  ISODate("2026-06-27T09:00:00Z"),
);
registrar(
  luis,
  "eliminar_permanente",
  "Eliminó definitivamente el archivo «borrador_descartado.txt»",
  ISODate("2026-08-04T15:30:00Z"),
);

historial.sort((a, b) => a.createdAt - b.createdAt);

bd.usuario.insertMany(usuarios);
bd.carpeta.insertMany(carpetas);
bd.documento.insertMany(documentos);
bd.documento_compartido.insertMany(compartidos);
bd.comentario.insertMany(comentarios);
bd.historial.insertMany(historial);

print("\nCarga inicial completada:");
[
  "usuario",
  "carpeta",
  "documento",
  "documento_compartido",
  "comentario",
  "historial",
].forEach((nombre) => {
  print(`  ${nombre.padEnd(22)} ${bd.getCollection(nombre).countDocuments()}`);
});
print(
  `  archivos en papelera   ${bd.documento.countDocuments({ fecha_eliminacion: { $ne: null } })}`,
);
print(
  `  carpetas en papelera   ${bd.carpeta.countDocuments({ fecha_eliminacion: { $ne: null } })}`,
);
