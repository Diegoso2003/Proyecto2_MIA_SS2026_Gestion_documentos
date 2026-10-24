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
}
