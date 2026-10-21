import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../util/api-url';
import { UsuarioCreateRequest } from '../models/usuario/usuario-create-request';
import { Observable } from 'rxjs';
import {
  UsuarioActuEstado,
  UsuarioActuPassword,
  UsuarioActuRequest,
} from '../models/usuario/usuario-actu-request';
import { UsuarioResponse } from '../models/usuario/usuario-response';
import { UsuarioFiltro } from '../models/usuario/usuario-filtro';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private _http = inject(HttpClient);
  private url = `${API_URL}/usuario`;

  crearUsuario(nuevo: UsuarioCreateRequest): Observable<void> {
    return this._http.post<void>(`${this.url}`, nuevo);
  }

  actualizarUsuario(id: string, actu: UsuarioActuRequest): Observable<void> {
    return this._http.put<void>(`${this.url}/${id}`, actu);
  }

  actuEstadoUsuario(id: string, actu: UsuarioActuEstado): Observable<void> {
    return this._http.patch<void>(`${this.url}/estado/${id}`, actu);
  }

  actuPasswordUsuario(id: string, actu: UsuarioActuPassword): Observable<void> {
    return this._http.patch<void>(`${this.url}/actu-password/${id}`, actu);
  }

  obtenerUsuarios(filtro: UsuarioFiltro): Observable<UsuarioResponse[]> {
    const params = this.obtenerParams(filtro);
    return this._http.get<UsuarioResponse[]>(`${this.url}`, { params });
  }

  private obtenerParams(filtro: UsuarioFiltro): HttpParams {
    let params = new HttpParams();
    Object.keys(filtro).forEach((llave) => {
      const valor = filtro[llave as keyof UsuarioFiltro];
      if (valor !== undefined && valor !== null) {
        params = params.set(llave, String(valor));
      }
    });
    return params;
  }
}
