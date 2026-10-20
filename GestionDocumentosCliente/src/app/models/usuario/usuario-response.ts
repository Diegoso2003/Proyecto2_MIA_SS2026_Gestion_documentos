export enum Rol {
  ADMIN = 'admin',
  USUARIO = 'usuario',
}

export interface UsuarioResponse {
  _id: string;
  nombre: string;
  correo: string;
  rol: Rol;
  activo: boolean;
}
