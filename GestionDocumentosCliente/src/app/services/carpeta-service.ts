import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../util/api-url';
import { Observable } from 'rxjs';
import { ContenidoCarpeta } from '../models/documentos/vista_documento';

@Injectable({
  providedIn: 'root',
})
export class CarpetaService {
  private _http = inject(HttpClient);
  private url = `${API_URL}/carpeta`;

  obtenerMisDocumentos(): Observable<ContenidoCarpeta> {
    return this._http.get<ContenidoCarpeta>(`${this.url}`);
  }

  obtenerDocumentosPorCarpeta(id: string): Observable<ContenidoCarpeta> {
    return this._http.get<ContenidoCarpeta>(`${this.url}/${id}`);
  }
}
