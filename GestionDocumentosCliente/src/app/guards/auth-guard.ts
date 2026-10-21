import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtService } from '../util/services/jwt-service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const _jwtTokenService = inject(JwtService);
  const _router = inject(Router);
  if (_jwtTokenService.estaAutenticado()) {
    return _router.createUrlTree(['/inicio/mis-documentos']);
  }
  return true;
};
