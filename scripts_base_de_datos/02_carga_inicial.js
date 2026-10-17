const bd = db.getSiblingDB("gestion_documentos");

if (bd.usuario.countDocuments() > 0) {
    throw new Error("La base ya tiene datos. Para recargar: db.getSiblingDB('gestion_documentos').dropDatabase() y vuelve a correr 01_crear_bd.js");
}

const fechaDe = (texto) => new Date(texto.replace(" ", "T") + ":00Z");
const mismoId = (a, b) => a.toString() === b.toString();
const aBytes = (texto) => unescape(encodeURIComponent(texto));

const historial = [];
function registrar(usuario, accion, descripcion, cuando, recurso) {
    const entrada = { usuario_id: usuario._id, accion, descripcion, createdAt: cuando };
    historial.push(entrada);
}

function crearUsuario(nombre, correo, rol, contraseña_hash, creado) {
    return {
        _id: new ObjectId(),
        nombre,
        correo,
        contraseña_hash,
        rol,
        activo: true,
        createdAt: fechaDe(creado),
        updatedAt: fechaDe(creado),
    };
}
const ana = crearUsuario("Ana Morales", "ana.morales@empresa.com", "administrador",
    "$argon2id$v=19$m=65536,t=3,p=4$i3g2sFThZUopb1I50fa74A$ehE0XaZdcHj2vpenaH8iMdXHol6oxFxKtutGvVog5eA", "2026-04-17 08:00");
const luis = crearUsuario("Luis Pérez", "luis.perez@empresa.com", "usuario",
    "$argon2id$v=19$m=65536,t=3,p=4$alO6eg7uZN3ZnjILyVLV4w$YM1Cw2fwOkkILw2x79zSQe3dNsMiQCKQ9JcwpSTSHIg", "2026-04-17 08:05");
const maria = crearUsuario("María López", "maria.lopez@empresa.com", "usuario",
    "$argon2id$v=19$m=65536,t=3,p=4$dLGS0oSRBTtjqQ0oRT36OQ$hjl47NTcHQnpVej0+URqAYuZf+hnaJGR8VQogQXj9zc", "2026-04-17 08:10");
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
        eliminado: false,
        fecha_eliminacion: null,
        createdAt: fechaDe(creada),
        updatedAt: fechaDe(creada),
    };
    carpetas.push(carpeta);
    registrar(dueño, "crear_carpeta",
        padre ? `Creó la carpeta «${nombre}» dentro de «${padre.nombre}»` : `Creó la carpeta «${nombre}» en la raíz`,
        carpeta.createdAt, carpeta);
    return carpeta;
}

const administracion = crearCarpeta("Administración", ana, null, "2026-04-17 09:00");
const contratos = crearCarpeta("Contratos", ana, administracion, "2026-04-17 09:10");
const informes = crearCarpeta("Informes", ana, administracion, "2026-04-17 09:20");
const politicas = crearCarpeta("Políticas", ana, null, "2026-04-17 09:30");
const proyectos = crearCarpeta("Proyectos", luis, null, "2026-04-17 10:00");
const alpha = crearCarpeta("Alpha", luis, proyectos, "2026-04-17 10:10");
const beta = crearCarpeta("Beta", luis, proyectos, "2026-04-17 10:20");
const documentacion = crearCarpeta("Documentación", luis, alpha, "2026-04-17 10:30");
const notas = crearCarpeta("Notas", luis, null, "2026-04-17 10:40");
const finanzas = crearCarpeta("Finanzas", maria, null, "2026-04-17 11:00");
const f2025 = crearCarpeta("2025", maria, finanzas, "2026-04-17 11:10");
const f2026 = crearCarpeta("2026", maria, finanzas, "2026-04-17 11:20");
const personal = crearCarpeta("Personal", maria, null, "2026-04-17 11:30");
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
    const cuando = fechaDe(creado);
    const contenido = contenidoDe(nombre, dueño, extension);

    const documento = {
        _id: new ObjectId(),
        nombre,
        propietario_id: dueño._id,
        carpeta_id: carpeta ? carpeta._id : null,
        detalles: { extension, tipo_mime, tamaño: aBytes(contenido).length },
        contenido,
        eliminado: false,
        fecha_eliminacion: null,
        createdAt: cuando,
        updatedAt: cuando,
    };
    documentos.push(documento);
    registrar(dueño, "subir",
        `Subió el archivo «${nombre}» a ${carpeta ? `la carpeta «${carpeta.nombre}»` : "la raíz"}`,
        cuando, documento);
}

crearArchivo("contrato_marco_proveedores.txt", ana, contratos, "2026-04-20 09:15");
crearArchivo("calendario_actividades_2026.txt", ana, null, "2026-04-23 12:00");
crearArchivo("informe_trimestral_q1.md", ana, informes, "2026-05-06 16:20");
crearArchivo("acuerdo_confidencialidad.md", ana, contratos, "2026-05-11 14:30");
crearArchivo("politica_seguridad_informacion.md", ana, politicas, "2026-05-20 09:45");
crearArchivo("contrato_arrendamiento_oficina.txt", ana, contratos, "2026-06-02 10:05");
crearArchivo("manual_induccion_empleados.md", ana, administracion, "2026-06-15 08:50");
crearArchivo("politica_teletrabajo.txt", ana, politicas, "2026-06-24 13:25");
crearArchivo("acta_reunion_directiva_junio.txt", ana, administracion, "2026-06-30 17:00");
crearArchivo("informe_trimestral_q2.md", ana, informes, "2026-07-08 11:40");
crearArchivo("directorio_proveedores.md", ana, null, "2026-08-05 09:20");
crearArchivo("informe_auditoria_interna.txt", ana, informes, "2026-08-19 15:10");
crearArchivo("politica_gastos_viaje.txt", ana, politicas, "2026-09-03 10:30");
crearArchivo("acta_reunion_directiva_septiembre.txt", ana, administracion, "2026-09-22 16:15");
crearArchivo("resumen_gestion_semestral.md", ana, administracion, "2026-10-07 11:10");

crearArchivo("propuesta_proyecto_alpha.md", luis, alpha, "2026-04-22 10:40");
crearArchivo("minuta_kickoff_alpha.txt", luis, proyectos, "2026-04-24 17:20");
crearArchivo("cronograma_proyectos.txt", luis, proyectos, "2026-05-02 08:40");
crearArchivo("requerimientos_alpha.txt", luis, alpha, "2026-05-08 15:55");
crearArchivo("propuesta_proyecto_beta.md", luis, beta, "2026-05-14 11:25");
crearArchivo("ideas_reunion_semanal.txt", luis, notas, "2026-05-22 10:10");
crearArchivo("arquitectura_alpha.md", luis, documentacion, "2026-05-27 09:35");
crearArchivo("requerimientos_beta.txt", luis, beta, "2026-06-05 09:00");
crearArchivo("manual_usuario_alpha.md", luis, documentacion, "2026-06-12 14:05");
crearArchivo("presupuesto_proyectos.md", luis, proyectos, "2026-06-19 12:15");
crearArchivo("guia_instalacion_alpha.txt", luis, documentacion, "2026-07-02 10:20");
crearArchivo("plan_pruebas_beta.txt", luis, beta, "2026-07-16 13:50");
crearArchivo("notas_capacitacion_mongodb.md", luis, notas, "2026-07-23 09:55");
crearArchivo("bitacora_alpha_julio.txt", luis, alpha, "2026-07-29 16:45");
crearArchivo("borrador_presentacion_cliente.md", luis, null, "2026-08-12 11:00");
crearArchivo("informe_avance_beta.md", luis, beta, "2026-08-27 15:30");
crearArchivo("pendientes_septiembre.txt", luis, notas, "2026-09-01 08:35");
crearArchivo("lecciones_aprendidas.md", luis, notas, "2026-09-17 14:40");
crearArchivo("resumen_diseño_proyectos_2026.txt", luis, null, "2026-10-02 15:00");
crearArchivo("checklist_entrega_final.txt", luis, proyectos, "2026-10-12 10:25");

crearArchivo("presupuesto_anual_2026.md", maria, f2026, "2026-04-21 09:30");
crearArchivo("balance_general_2025.md", maria, f2025, "2026-05-04 09:05");
crearArchivo("flujo_caja_enero.txt", maria, f2026, "2026-05-18 14:15");
crearArchivo("estado_resultados_2025.txt", maria, f2025, "2026-05-25 13:40");
crearArchivo("metas_personales.md", maria, personal, "2026-05-31 18:10");
crearArchivo("flujo_caja_febrero.txt", maria, f2026, "2026-06-08 10:50");
crearArchivo("politica_cobranza.txt", maria, finanzas, "2026-06-17 12:30");
crearArchivo("conciliacion_bancaria_mayo.txt", maria, f2026, "2026-06-29 16:05");
crearArchivo("cierre_contable_2025.txt", maria, f2025, "2026-07-06 15:20");
crearArchivo("informe_impuestos_2025.md", maria, f2025, "2026-07-21 10:00");
crearArchivo("proyeccion_ingresos_2026.md", maria, f2026, "2026-08-10 11:35");
crearArchivo("ideas_capacitacion.txt", maria, personal, "2026-08-24 17:30");
crearArchivo("resumen_gastos_trimestre.md", maria, finanzas, "2026-09-09 14:55");
crearArchivo("lista_facturas_pendientes.txt", maria, finanzas, "2026-09-28 09:40");
crearArchivo("plan_vacaciones.txt", maria, personal, "2026-10-09 12:45");

const compartidos = [];
const textoPermiso = { lectura: "lectura", edicion: "edición", comentar: "comentar" };

function compartir(recurso, tipo, dueño, destino, permiso, cuando) {
    const fecha = fechaDe(cuando);
    const compartido = {
        _id: new ObjectId(),
        recurso_tipo: tipo,
        recurso_id: recurso._id,
        propietario_id: dueño._id,
        usuario_destino_id: destino._id,
        permiso,
        createdAt: fecha,
        updatedAt: fecha,
    };
    compartidos.push(compartido);
    registrar(dueño, "compartir",
        `Compartió ${tipo === "carpeta" ? "la carpeta" : "el archivo"} «${recurso.nombre}» con ${destino.nombre} (permiso: ${textoPermiso[permiso]})`,
        fecha, recurso);
    return { compartido, recurso, tipo, dueño, destino };
}
const compartirArchivo = (nombre, dueño, destino, permiso, cuando) =>
    compartir(archivo(nombre), "archivo", dueño, destino, permiso, cuando);

compartir(contratos, "carpeta", ana, luis, "lectura", "2026-04-18 10:00");
compartir(proyectos, "carpeta", luis, maria, "edicion", "2026-04-18 11:00");
compartir(finanzas, "carpeta", maria, ana, "comentar", "2026-04-18 12:00");

compartirArchivo("contrato_marco_proveedores.txt", ana, luis, "lectura", "2026-04-21 11:00");
compartirArchivo("contrato_marco_proveedores.txt", ana, maria, "comentar", "2026-04-21 11:05");
compartirArchivo("informe_trimestral_q1.md", ana, maria, "lectura", "2026-05-07 10:00");
compartirArchivo("acuerdo_confidencialidad.md", ana, luis, "comentar", "2026-05-12 09:30");
compartirArchivo("politica_seguridad_informacion.md", ana, luis, "lectura", "2026-05-21 08:00");
compartirArchivo("politica_seguridad_informacion.md", ana, maria, "lectura", "2026-05-21 08:05");
compartirArchivo("manual_induccion_empleados.md", ana, maria, "edicion", "2026-06-16 09:00");
compartirArchivo("acta_reunion_directiva_junio.txt", ana, luis, "comentar", "2026-07-01 10:00");
compartirArchivo("informe_trimestral_q2.md", ana, luis, "lectura", "2026-07-09 09:00");

compartirArchivo("propuesta_proyecto_alpha.md", luis, ana, "lectura", "2026-04-23 09:00");
compartirArchivo("propuesta_proyecto_alpha.md", luis, maria, "comentar", "2026-04-23 09:05");
const cronogramaAna = compartirArchivo("cronograma_proyectos.txt", luis, ana, "edicion", "2026-05-03 09:00");
compartirArchivo("cronograma_proyectos.txt", luis, maria, "lectura", "2026-05-03 09:05");
compartirArchivo("arquitectura_alpha.md", luis, ana, "comentar", "2026-05-28 10:00");
compartirArchivo("manual_usuario_alpha.md", luis, maria, "lectura", "2026-06-13 09:30");
compartirArchivo("presupuesto_proyectos.md", luis, maria, "comentar", "2026-06-20 10:30");
compartirArchivo("guia_instalacion_alpha.txt", luis, ana, "lectura", "2026-07-03 11:00");
compartirArchivo("notas_capacitacion_mongodb.md", luis, ana, "lectura", "2026-07-24 10:00");

compartirArchivo("presupuesto_anual_2026.md", maria, ana, "lectura", "2026-04-22 10:00");
compartirArchivo("presupuesto_anual_2026.md", maria, luis, "comentar", "2026-04-22 10:05");
compartirArchivo("flujo_caja_enero.txt", maria, ana, "comentar", "2026-05-19 09:00");
compartirArchivo("politica_cobranza.txt", maria, luis, "lectura", "2026-06-18 09:30");
compartirArchivo("proyeccion_ingresos_2026.md", maria, ana, "edicion", "2026-08-11 09:00");
compartirArchivo("resumen_gastos_trimestre.md", maria, luis, "lectura", "2026-09-10 10:00");

function cambiarPermiso(registro, permisoNuevo, cuando) {
    const fecha = fechaDe(cuando);
    const anterior = registro.compartido.permiso;
    registro.compartido.permiso = permisoNuevo;
    registro.compartido.updatedAt = fecha;
    registrar(registro.dueño, "modificar_permiso",
        `Cambió el permiso de ${registro.destino.nombre} sobre «${registro.recurso.nombre}» de ${textoPermiso[anterior]} a ${textoPermiso[permisoNuevo]}`,
        fecha, registro.recurso);
}
cambiarPermiso(cronogramaAna, "lectura", "2026-09-12 14:00");

function revocar(registro, cuando) {
    compartidos.splice(compartidos.indexOf(registro.compartido), 1);
    registrar(registro.dueño, "revocar_permiso",
        `Retiró el acceso de ${registro.destino.nombre} al archivo «${registro.recurso.nombre}»`,
        fechaDe(cuando), registro.recurso);
}
const temporal = compartirArchivo("notas_capacitacion_mongodb.md", luis, maria, "lectura", "2026-07-24 10:10");
revocar(temporal, "2026-08-03 09:00");

const comentarios = [];
function comentar(usuario, nombreArchivo, texto, cuando) {
    const documento = archivo(nombreArchivo);
    const fecha = fechaDe(cuando);
    comentarios.push({
        _id: new ObjectId(),
        documento_id: documento._id,
        usuario: { _id: usuario._id, nombre: usuario.nombre },
        texto,
        createdAt: fecha,
        updatedAt: fecha,
    });
    registrar(usuario, "comentar", `Comentó en el archivo «${nombreArchivo}»`, fecha, documento);
}
comentar(maria, "contrato_marco_proveedores.txt", "Revisé las cláusulas de pago, todo en orden.", "2026-04-22 09:00");
comentar(ana, "contrato_marco_proveedores.txt", "Gracias, quedo atenta a más observaciones.", "2026-04-22 10:30");
comentar(luis, "presupuesto_anual_2026.md", "Aprobado de mi parte.", "2026-04-23 15:00");
comentar(maria, "propuesta_proyecto_alpha.md", "¿Podemos confirmar el alcance antes del kickoff?", "2026-04-24 08:45");
comentar(luis, "propuesta_proyecto_alpha.md", "Sí, lo revisamos en la reunión del jueves.", "2026-04-24 10:00");
comentar(luis, "acuerdo_confidencialidad.md", "Falta definir la vigencia del acuerdo.", "2026-05-13 10:00");
comentar(ana, "acuerdo_confidencialidad.md", "Lo agrego hoy mismo.", "2026-05-13 11:15");
comentar(ana, "flujo_caja_enero.txt", "Confirmar la cifra de ingresos de la semana 3.", "2026-05-20 10:30");
comentar(ana, "arquitectura_alpha.md", "Sugiero documentar también el diagrama de despliegue.", "2026-05-29 14:00");
comentar(maria, "presupuesto_proyectos.md", "Los montos del segundo trimestre no coinciden con finanzas.", "2026-06-21 09:20");
comentar(luis, "presupuesto_proyectos.md", "Gracias, los corrijo.", "2026-06-21 11:00");
comentar(luis, "acta_reunion_directiva_junio.txt", "Hay un acuerdo repetido en el punto 4.", "2026-07-02 09:30");

function descargar(usuario, nombreArchivo, cuando) {
    registrar(usuario, "descargar", `Descargó el archivo «${nombreArchivo}»`, fechaDe(cuando), archivo(nombreArchivo));
}
descargar(ana, "contrato_marco_proveedores.txt", "2026-04-22 09:10");
descargar(maria, "propuesta_proyecto_alpha.md", "2026-04-24 08:30");
descargar(ana, "presupuesto_anual_2026.md", "2026-04-23 08:50");
descargar(luis, "contrato_marco_proveedores.txt", "2026-04-25 11:20");
descargar(luis, "propuesta_proyecto_alpha.md", "2026-04-25 09:00");
descargar(maria, "contrato_marco_proveedores.txt", "2026-04-26 14:00");
descargar(ana, "propuesta_proyecto_alpha.md", "2026-04-27 12:00");
descargar(ana, "contrato_marco_proveedores.txt", "2026-05-15 10:00");
descargar(luis, "politica_seguridad_informacion.md", "2026-05-22 09:30");
descargar(maria, "politica_seguridad_informacion.md", "2026-05-26 13:00");
descargar(luis, "propuesta_proyecto_alpha.md", "2026-05-30 10:30");
descargar(maria, "presupuesto_anual_2026.md", "2026-06-01 09:15");
descargar(luis, "manual_usuario_alpha.md", "2026-06-14 11:15");
descargar(maria, "manual_usuario_alpha.md", "2026-06-14 15:40");
descargar(ana, "contrato_marco_proveedores.txt", "2026-07-01 16:30");

function renombrar(nombreActual, nombreNuevo, cuando) {
    const documento = archivo(nombreActual);
    documento.nombre = nombreNuevo;
    documento.updatedAt = fechaDe(cuando);
    registrar(dueñoDe(documento.propietario_id), "renombrar",
        `Renombró el archivo «${nombreActual}» a «${nombreNuevo}»`, documento.updatedAt, documento);
}
renombrar("directorio_proveedores.md", "directorio_proveedores_2026.md", "2026-08-20 09:50");
renombrar("metas_personales.md", "metas_personales_2026.md", "2026-09-30 10:00");

function moverArchivo(nombre, destino, cuando) {
    const documento = archivo(nombre);
    const origen = carpetaPorId(documento.carpeta_id);
    documento.carpeta_id = destino._id;
    documento.updatedAt = fechaDe(cuando);
    registrar(dueñoDe(documento.propietario_id), "mover",
        `Movió el archivo «${nombre}» de la carpeta «${origen.nombre}» a la carpeta «${destino.nombre}»`,
        documento.updatedAt, documento);
}
moverArchivo("requerimientos_alpha.txt", documentacion, "2026-06-25 10:00");
moverArchivo("lista_facturas_pendientes.txt", f2026, "2026-10-01 14:00");

function archivoAPapelera(nombre, cuando) {
    const documento = archivo(nombre);
    const fecha = fechaDe(cuando);
    documento.eliminado = true;
    documento.fecha_eliminacion = fecha;
    documento.updatedAt = fecha;
    registrar(dueñoDe(documento.propietario_id), "eliminar", `Envió a la papelera el archivo «${nombre}»`, fecha, documento);
}

function restaurarArchivo(nombre, cuando) {
    const documento = archivo(nombre);
    const fecha = fechaDe(cuando);
    documento.eliminado = false;
    documento.fecha_eliminacion = null;
    documento.updatedAt = fecha;
    registrar(dueñoDe(documento.propietario_id), "restaurar", `Restauró el archivo «${nombre}» desde la papelera`, fecha, documento);
}

function carpetaAPapelera(raiz, cuando) {
    const fecha = fechaDe(cuando);
    const subarbol = carpetas.filter((c) => mismoId(c._id, raiz._id) || c.ancestros.some((a) => mismoId(a, raiz._id)));
    const idsCarpetas = subarbol.map((c) => c._id.toString());
    subarbol.forEach((c) => {
        c.eliminado = true;
        c.fecha_eliminacion = fecha;
        c.updatedAt = fecha;
    });
    const archivos = documentos.filter((d) => d.carpeta_id && idsCarpetas.includes(d.carpeta_id.toString()) && !d.eliminado);
    archivos.forEach((d) => {
        d.eliminado = true;
        d.fecha_eliminacion = fecha;
        d.updatedAt = fecha;
    });
    registrar(dueñoDe(raiz.propietario_id), "eliminar",
        `Envió a la papelera la carpeta «${raiz.nombre}» (${archivos.length} archivos y ${subarbol.length - 1} subcarpetas)`,
        fecha, raiz);
}

archivoAPapelera("ideas_reunion_semanal.txt", "2026-06-02 16:00");
archivoAPapelera("conciliacion_bancaria_mayo.txt", "2026-07-15 09:05");
archivoAPapelera("bitacora_alpha_julio.txt", "2026-08-30 09:30");
archivoAPapelera("informe_auditoria_interna.txt", "2026-09-10 10:00");
archivoAPapelera("ideas_capacitacion.txt", "2026-09-15 11:20");
carpetaAPapelera(beta, "2026-10-08 09:00");
carpetaAPapelera(f2025, "2026-10-10 10:30");
archivoAPapelera("politica_gastos_viaje.txt", "2026-09-20 10:00");
restaurarArchivo("politica_gastos_viaje.txt", "2026-09-21 09:00");

registrar(luis, "subir", "Subió el archivo «borrador_descartado.txt» a la carpeta «Notas»", fechaDe("2026-06-26 10:00"));
registrar(luis, "eliminar", "Envió a la papelera el archivo «borrador_descartado.txt»", fechaDe("2026-06-27 09:00"));
registrar(luis, "eliminar_permanente", "Eliminó definitivamente el archivo «borrador_descartado.txt»", fechaDe("2026-08-04 15:30"));

historial.sort((a, b) => a.createdAt - b.createdAt);

bd.usuario.insertMany(usuarios);
bd.carpeta.insertMany(carpetas);
bd.documento.insertMany(documentos);
bd.documento_compartido.insertMany(compartidos);
bd.comentario.insertMany(comentarios);
bd.historial.insertMany(historial);

print("\nCarga inicial completada:");
["usuario", "carpeta", "documento", "documento_compartido", "comentario", "historial"].forEach((nombre) => {
    print(`  ${nombre.padEnd(22)} ${bd.getCollection(nombre).countDocuments()}`);
});
print(`  archivos en papelera   ${bd.documento.countDocuments({ eliminado: true })}`);
print(`  carpetas en papelera   ${bd.carpeta.countDocuments({ eliminado: true })}`);
