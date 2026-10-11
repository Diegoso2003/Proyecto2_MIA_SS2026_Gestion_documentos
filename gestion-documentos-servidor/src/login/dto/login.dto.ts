import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @IsEmail({}, { message: 'Ingrese un email valido'})
    email: string;
    @IsString({ message: 'la contraseña debe ser un string' })
    @IsNotEmpty({ message: 'Ingrese su contraseña correctamente' })
    contraseña: string;
}