import { CanActivateFn, Router } from '@angular/router';
import { JwtService } from '../util/services/jwt-service';
import { inject } from '@angular/core';

export const UsuarioGuard: CanActivateFn = (route, state) => {
  const _jwtTokenService = inject(JwtService);
  const _router = inject(Router);
  if (!_jwtTokenService.estaAutenticado()) {
    return _router.createUrlTree(['/login']);
  }
  return true;
};
