import { Rol } from './usuario-response';

export interface UsuarioActuRequest {
  nombre: string;
  correo: string;
  rol: Rol;
}

export interface UsuarioActuPassword {
  contraseña: string;
}

export interface UsuarioActuEstado {
  estado: boolean;
}
