import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../util/api-url';
import { ComentarioVistaModel } from '../models/documentos/documento_model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ComentarioService {
  private _http = inject(HttpClient);
  private url = `${API_URL}/comentario`;

  listarPorDocumento(id: string): Observable<ComentarioVistaModel[]> {
    return this._http.get<ComentarioVistaModel[]>(`${this.url}/documento/${id}`);
  }

  crear(documentoId: string, comentario: string): Observable<void> {
    return this._http.post<void>(`${this.url}`, { documentoId, comentario });
  }

  editar(comentarioId: string, comentario: string): Observable<void> {
    return this._http.patch<void>(`${this.url}/${comentarioId}`, { comentario });
  }
}
