import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtService } from '../util/services/jwt-service';
import { Rol } from '../models/usuario/usuario-response';

export const AdminGuard: CanActivateFn = (route, state) => {
  const _jwtTokenService = inject(JwtService);
  const _router = inject(Router);
  if (!_jwtTokenService.estaAutenticado()) {
    return _router.createUrlTree(['/login']);
  }
  return _jwtTokenService.getRol() === Rol.ADMIN;
};
