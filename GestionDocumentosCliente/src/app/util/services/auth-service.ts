import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginDTO } from '../models/login-dto';
import { Observable } from 'rxjs';
import { JwtToken } from '../models/jwt-token';
import { API_URL } from '../api-url';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _http = inject(HttpClient);

  login(login: LoginDTO): Observable<JwtToken> {
    return this._http.post<JwtToken>(`${API_URL}/login`, login);
  }
}
