import { NodoMenu } from './nodo-menu';

export const SECCIONES: NodoMenu[] = [
  { nombre: 'Mis documentos', icono: 'folder', ruta: '/inicio/mi-unidad' },
  { nombre: 'Compartido conmigo', icono: 'group', ruta: '/inicio/compartidos' },
  { nombre: 'Destacados', icono: 'star', ruta: '/inicio/destacados' },
  { nombre: 'Papelera', icono: 'delete', ruta: '/inicio/papelera' },
];

export const USUARIOS: NodoMenu = { nombre: 'Usuarios', icono: 'groups', ruta: '/inicio/usuarios' };

export const REPORTES: NodoMenu[] = [
  {
    nombre: 'Reportes',
    icono: 'bar_chart',
    hijos: [
      {
        nombre: 'Archivos',
        icono: 'description',
        hijos: [
          { nombre: 'Por tipo', ruta: '/reportes/archivos-tipo' },
          { nombre: 'Por fechas', ruta: '/reportes/archivos-fechas' },
          { nombre: 'Más operados', ruta: '/reportes/archivos-operaciones' },
        ],
      },
      {
        nombre: 'Usuarios',
        icono: 'person',
        hijos: [
          { nombre: 'Top 10 archivos', ruta: '/reportes/usuarios-top' },
          { nombre: 'Más compartidores', ruta: '/reportes/usuarios-compartidos' },
        ],
      },
      {
        nombre: 'Compartición',
        icono: 'share',
        hijos: [
          { nombre: 'Más compartidos', ruta: '/reportes/comparticion-archivos' },
          { nombre: 'Enviados', ruta: '/reportes/comparticion-enviados' },
          { nombre: 'Recibidos', ruta: '/reportes/comparticion-recibidos' },
        ],
      },
      {
        nombre: 'Actividad',
        icono: 'history',
        hijos: [
          { nombre: 'Historial', ruta: '/reportes/actividad-historial' },
          { nombre: 'Por tipo', ruta: '/reportes/actividad-tipo' },
          { nombre: 'Por período', ruta: '/reportes/actividad-periodo' },
          { nombre: 'Top acciones', ruta: '/reportes/actividad-acciones' },
        ],
      },
    ],
  },
];
