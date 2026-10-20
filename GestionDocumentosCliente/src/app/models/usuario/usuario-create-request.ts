import { Rol } from './usuario-response';

export interface UsuarioCreateRequest {
  nombre: string;
  correo: string;
  contraseña: string;
  rol: Rol;
}
