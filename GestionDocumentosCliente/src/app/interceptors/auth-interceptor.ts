import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { JwtService } from '../util/services/jwt-service';
import { API_URL } from '../util/api-url';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const _jwtService = inject(JwtService);
  const token = _jwtService.getToken();

  const URL_EXCLUIDAS = [`${API_URL}/login`];

  const isExcluded = URL_EXCLUIDAS.some((url) => req.url.includes(url));
  if (isExcluded) {
    return next(req);
  }

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(authReq);
  }

  return next(req);
};
