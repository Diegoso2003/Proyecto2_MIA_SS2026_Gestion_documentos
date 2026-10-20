import { Rol } from './usuario-response';

export interface UsuarioActuRequest {
  nombre: string;
  _id: string;
  correo: string;
  rol: Rol;
}

export interface UsuarioActuPassword {
  _id: string;
  contraseña: string;
}

export interface UsuarioActuEstado {
  _id: string;
  estado: boolean;
}
