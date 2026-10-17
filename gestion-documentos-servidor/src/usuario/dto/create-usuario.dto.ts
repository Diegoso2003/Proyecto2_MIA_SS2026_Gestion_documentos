import { Rol } from "../Rol.js";

export class CreateUsuarioDto {
    nombre: string;
    contraseña: string;
    rol: Rol;
    email: string;
}
