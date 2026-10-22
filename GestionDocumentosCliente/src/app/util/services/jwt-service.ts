import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { JwtToken } from '../models/jwt-token';
import { Rol } from '../../models/usuario/usuario-response';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  guardarToken(jwt: JwtToken): void {
    localStorage.setItem('token', jwt.token);
  }

  getRol(): Rol {
    const token = localStorage.getItem('token');
    if (token) {
      const decodePayload = jwtDecode<JwtPayload>(token);
      return decodePayload.rol as Rol;
    }
    return Rol.USUARIO;
  }

  getIdUsuario(): string {
    const token = localStorage.getItem('token');
    if (token) {
      const decodePayload = jwtDecode<JwtPayload>(token);
      return decodePayload.id;
    }
    return '';
  }

  getToken(): string {
    return localStorage.getItem('token') ?? '';
  }

  estaAutenticado(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}

interface JwtPayload {
  rol: Rol;
  id: string;
  iat: number;
  exp: number;
}
