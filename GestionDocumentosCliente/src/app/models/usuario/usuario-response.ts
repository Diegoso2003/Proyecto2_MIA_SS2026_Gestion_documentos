export enum Rol {
  ADMIN = 'administrador',
  USUARIO = 'usuario',
}

export const ROLES = Object.values(Rol);

export interface UsuarioResponse {
  _id: string;
  nombre: string;
  correo: string;
  rol: Rol;
  activo: boolean;
}
