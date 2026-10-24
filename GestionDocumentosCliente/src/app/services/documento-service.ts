import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../util/api-url';
import { DocumentoVistaModel } from '../models/documentos/documento_model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentoService {
  private _http = inject(HttpClient);
  private url = `${API_URL}/documento`;

  obtenerPorId(id: string): Observable<DocumentoVistaModel> {
    return this._http.get<DocumentoVistaModel>(`${this.url}/${id}`);
  }

  actualizarContenido(id: string, contenido: string): Observable<void> {
    return this._http.patch<void>(`${this.url}/${id}`, { contenido });
  }
}
