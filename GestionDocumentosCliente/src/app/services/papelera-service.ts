import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../util/api-url';
import { ContenidoPapelera } from '../models/documentos/papelera';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PapeleraService {
  private _http = inject(HttpClient);
  private url = `${API_URL}/papelera`;

  obtenerPapelera(): Observable<ContenidoPapelera> {
    return this._http.get<ContenidoPapelera>(`${this.url}`);
  }

  restaurarArchivo(id: string): Observable<void> {
    return this._http.patch<void>(`${this.url}/restaurar-archivo/${id}`, {});
  }

  restaurarCarpetas(id: string): Observable<void> {
    return this._http.patch<void>(`${this.url}/restaurar-carpeta/${id}`, {});
  }

  eliminarArchivo(id: string): Observable<void> {
    return this._http.delete<void>(`${this.url}/documento/${id}`);
  }

  eliminarCarpeta(id: string): Observable<void> {
    return this._http.delete<void>(`${this.url}/carpeta/${id}`);
  }
}
