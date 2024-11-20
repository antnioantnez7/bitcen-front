import { Routes } from '@angular/router';
import { LoginPageComponent } from './UI/auth/pages/login-page/login-page.component';
import { BitacoraComponent } from './UI/pages/bitacora/bitacora.component';
import { CatalogoAplicacionesComponent } from './UI/components/catalogo-aplicaciones/catalogo-aplicaciones.component';
import { authGuard } from './infrastructure/helpers/auth.guard';
import { CatalogoUsuariosComponent } from './UI/components/catalogo-usuarios/catalogo-usuarios.component';
import { authRolesGuard } from './infrastructure/helpers/auth-roles.guard';



export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginPageComponent,
    title: 'Login'
  },
  {
    path: 'bitacora',
    canActivate: [authGuard],
    data: { breadcrumb: 'Consulta de Bitácora'},
    component: BitacoraComponent,
    title: 'Bitacora'
  },
  {
    path: '',
    title: 'Catálogos',
    canActivateChild: [authRolesGuard],
    data: { roles: ['ADMINISTRADOR', 'ADMIN', 'AUDITOR']},
    children: [{
        path: 'aplicaciones',
        data: { breadcrumb: 'Catálogo de Aplicaciones' },
        component: CatalogoAplicacionesComponent,
        title: 'Catalogo de Aplicaciones'
      },
      {
        path: 'usuarios',
        data: { breadcrumb: 'Catálogo de Usuarios' },
        component: CatalogoUsuariosComponent,
        title: 'Catalogo de Usuarios'
      }],
  },
  { path: '**', redirectTo: '/login' }
];

