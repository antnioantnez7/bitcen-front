import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from "@angular/router";


//Proteje las rutas en función al rol del usuario
export const authRolesGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const userRole = sessionStorage.getItem('perfil');
  const allowedRoles = route.data?.['roles'];

  let permiso = Boolean(allowedRoles.includes(userRole));
  return permiso;

};
