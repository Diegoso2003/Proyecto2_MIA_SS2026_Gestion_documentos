import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../util/api-url';
import { Observable } from 'rxjs';
import { ReporteArchivosPorTipo } from '../models/reportes/reporte-response';
import { ReporteArchivosPorRango } from '../models/reportes/reporte-rango-fecha';
import { ReporteArchivosMasOperaciones } from '../models/reportes/archivos-mas-operaciones';
import { ReporteTopUsuariosArchivos } from '../models/reportes/top-usuarios-archivos';
import { ReporteUsuariosMasCompartidos } from '../models/reportes/reporte-mas-compartidos';
import { ReporteArchivosMasCompartidos } from '../models/reportes/archivo-mas-compartido';
import { ReporteComparticionesUsuario } from '../models/reportes/reporte-comparticion-usuario';
import { ReporteHistorialUsuario } from '../models/reportes/historial-usuario';
import { ReporteActividadPorTipo } from '../models/reportes/actividad-por-tipo';
import { ReporteActividadPorPeriodo } from '../models/reportes/actividad-por-periodo';
import { ReportePrincipalesAcciones } from '../models/reportes/principales-acciones';

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

  usuariosMasCompartidos(
    params: Record<string, string | number>,
  ): Observable<ReporteUsuariosMasCompartidos> {
    return this._http.get<ReporteUsuariosMasCompartidos>(`${this.url}/usuarios/mas-compartidos`, {
      params: new HttpParams({ fromObject: params }),
    });
  }

  archivosMasCompartidos(
    params: Record<string, string | number>,
  ): Observable<ReporteArchivosMasCompartidos> {
    return this._http.get<ReporteArchivosMasCompartidos>(
      `${this.url}/comparticion/archivos-mas-compartidos`,
      { params: new HttpParams({ fromObject: params }) },
    );
  }

  compartidosPorUsuario(params: Record<string, string>): Observable<ReporteComparticionesUsuario> {
    return this._http.get<ReporteComparticionesUsuario>(
      `${this.url}/comparticion/compartidos-por-usuario`,
      { params: new HttpParams({ fromObject: params }) },
    );
  }

  recibidosPorUsuario(params: Record<string, string>): Observable<ReporteComparticionesUsuario> {
    return this._http.get<ReporteComparticionesUsuario>(
      `${this.url}/comparticion/recibidos-por-usuario`,
      { params: new HttpParams({ fromObject: params }) },
    );
  }

  historialUsuario(params: Record<string, string | number>): Observable<ReporteHistorialUsuario> {
    return this._http.get<ReporteHistorialUsuario>(`${this.url}/actividad/historial-usuario`, {
      params: new HttpParams({ fromObject: params }),
    });
  }

  actividadPorTipo(params: Record<string, string>): Observable<ReporteActividadPorTipo> {
    return this._http.get<ReporteActividadPorTipo>(`${this.url}/actividad/por-tipo`, {
      params: new HttpParams({ fromObject: params }),
    });
  }

  actividadPorPeriodo(params: Record<string, string>): Observable<ReporteActividadPorPeriodo> {
    return this._http.get<ReporteActividadPorPeriodo>(`${this.url}/actividad/por-periodo`, {
      params: new HttpParams({ fromObject: params }),
    });
  }

  principalesAcciones(
    params: Record<string, string | number>,
  ): Observable<ReportePrincipalesAcciones> {
    return this._http.get<ReportePrincipalesAcciones>(
      `${this.url}/actividad/principales-acciones`,
      { params: new HttpParams({ fromObject: params }) },
    );
  }
}
