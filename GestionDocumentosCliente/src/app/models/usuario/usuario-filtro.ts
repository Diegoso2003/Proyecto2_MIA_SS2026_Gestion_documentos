import { Rol } from './usuario-response';

export interface UsuarioFiltro {
  rol: Rol | null;
  estado: boolean | null;
  correo: string | null;
}

export const FILTRO_USUARIO_VACIO: UsuarioFiltro = { rol: null, estado: null, correo: null };
