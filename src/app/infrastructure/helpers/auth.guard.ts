import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { inject } from "@angular/core";
import { UsuarioService } from "../driven-adapter/usuario.service";
import { map } from "rxjs";


//Proteje las rutas en función del estado de autenticación del usuario
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(UsuarioService);
  const router = inject(Router);

  return authService.isLoggedIn.pipe(
    map((isLoggedIn) => isLoggedIn || router.createUrlTree(['/login']))
  );

};

