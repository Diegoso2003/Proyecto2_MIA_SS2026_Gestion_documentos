import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../util/api-url';
import { Observable } from 'rxjs';
import { ContenidoCarpeta } from '../models/documentos/vista_documento';
import { CompartidoFila, ListaCompartidos } from '../models/documentos/compartido-model';

@Injectable({
  providedIn: 'root',
})
export class CompartidosService {
  private _http = inject(HttpClient);
  private url = `${API_URL}/compartido`;

  obtenerCarpetasCompartidas(): Observable<ContenidoCarpeta> {
    return this._http.get<ContenidoCarpeta>(`${this.url}/carpeta`);
  }

  obtenerCarpetaConId(id: string): Observable<ContenidoCarpeta> {
    return this._http.get<ContenidoCarpeta>(`${this.url}/carpeta/${id}`);
  }

  listar(recursoTipo: 'archivo' | 'carpeta', recursoId: string): Observable<ListaCompartidos> {
    return this._http.get<ListaCompartidos>(this.url, {
      params: new HttpParams({ fromObject: { recursoTipo, recursoId } }),
    });
  }
  compartir(
    recursoTipo: 'archivo' | 'carpeta',
    recursoId: string,
    correo: string,
    permiso: string,
  ): Observable<CompartidoFila> {
    return this._http.post<CompartidoFila>(this.url, {
      recursoTipo,
      recursoId,
      correo,
      permiso,
    });
  }

  actualizarPermiso(
    recursoTipo: 'archivo' | 'carpeta',
    recursoId: string,
    usuarioDestinoId: string,
    permiso: string,
  ): Observable<CompartidoFila> {
    return this._http.patch<CompartidoFila>(`${this.url}/permiso`, {
      recursoTipo,
      recursoId,
      usuarioDestinoId,
      permiso,
    });
  }

  revocar(
    recursoTipo: 'archivo' | 'carpeta',
    recursoId: string,
    usuarioDestinoId: string,
  ): Observable<{ mensaje: string }> {
    return this._http.delete<{ mensaje: string }>(`${this.url}/permiso`, {
      body: { recursoTipo, recursoId, usuarioDestinoId },
    });
  }
}
