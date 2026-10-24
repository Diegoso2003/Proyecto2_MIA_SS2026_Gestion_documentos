import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../util/api-url';
import { Observable } from 'rxjs';
import { ReporteArchivosPorTipo } from '../models/reportes/reporte-response';
import { ReporteArchivosPorRango } from '../models/reportes/reporte-rango-fecha';
import { ReporteArchivosMasOperaciones } from '../models/reportes/archivos-mas-operaciones';
import { ReporteTopUsuariosArchivos } from '../models/reportes/top-usuarios-archivos';

@Injectable({
  providedIn: 'root',
})
export class ReporteService {
  private _http = inject(HttpClient);
  private url = `${API_URL}/reportes`;

  archivosPorTipo(params: Record<string, string | boolean>): Observable<ReporteArchivosPorTipo> {
    return this._http.get<ReporteArchivosPorTipo>(`${this.url}/archivos/por-tipo`, {
      params: new HttpParams({ fromObject: params as Record<string, string> }),
    });
  }

  archivosPorRangoFechas(
    params: Record<string, string | number>,
  ): Observable<ReporteArchivosPorRango> {
    return this._http.get<ReporteArchivosPorRango>(`${this.url}/archivos/por-rango-fechas`, {
      params: new HttpParams({ fromObject: params }),
    });
  }

  archivosMasOperaciones(
    params: Record<string, string | number>,
  ): Observable<ReporteArchivosMasOperaciones> {
    return this._http.get<ReporteArchivosMasOperaciones>(`${this.url}/archivos/mas-operaciones`, {
      params: new HttpParams({ fromObject: params }),
    });
  }

  topUsuariosArchivos(
    params: Record<string, string | boolean>,
  ): Observable<ReporteTopUsuariosArchivos> {
    return this._http.get<ReporteTopUsuariosArchivos>(`${this.url}/usuarios/top-archivos`, {
      params: new HttpParams({ fromObject: params }),
    });
  }
}
