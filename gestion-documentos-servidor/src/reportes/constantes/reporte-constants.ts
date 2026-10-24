export const EXTENSIONES = ['txt', 'md'] as const;

export const RECURSOS_TIPO = ['archivo', 'carpeta'] as const;

export const PERMISOS = ['lectura', 'edicion', 'comentar'] as const;

export const PERIODOS = ['dia', 'semana', 'mes'] as const;

export const ACCIONES = [
  'crear_carpeta',
  'subir',
  'compartir',
  'modificar_permiso',
  'revocar_permiso',
  'comentar',
  'descargar',
  'renombrar',
  'mover',
  'eliminar',
  'eliminar_permanente',
  'restaurar',
] as const;

export const ACCIONES_ARCHIVO = [
  'subir',
  'descargar',
  'renombrar',
  'mover',
  'comentar',
  'compartir',
  'modificar_permiso',
  'revocar_permiso',
  'eliminar',
  'restaurar',
] as const;
