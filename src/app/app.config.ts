import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { UsuarioGateway } from './domain/models/gateway/usuario.gateway';
import { UsuarioService } from './infrastructure/driven-adapter/usuario.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authconfigInterceptor } from './infrastructure/helpers/authconfig.interceptor';
import { BitacoraGateway } from './domain/models/gateway/bitacora.gateway';
import { BitacoraService } from './infrastructure/driven-adapter/bitacora.service';
import { RegistroBitacoraGateway } from './domain/models/gateway/registroBitacora.gateway';
import { RegitroBitacoraService } from './infrastructure/driven-adapter/registro-bitacora.service';
import { AplicacionCatGateway } from './domain/models/gateway/aplicacionCat.gateway';
import { AplicacionService } from './infrastructure/driven-adapter/aplicacion.service';
import { UsuarioCatGateway } from './domain/models/gateway/usuariosCat.gateway';
import { UsuarioCatalogoService } from './infrastructure/driven-adapter/usuario-catalogo.service';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withComponentInputBinding()),
  provideHttpClient(withInterceptors([authconfigInterceptor])),
  // provideHttpClient(withFetch()),
  { provide: UsuarioGateway, useClass: UsuarioService },
  { provide: BitacoraGateway, useClass: BitacoraService},
  { provide: RegistroBitacoraGateway, useClass: RegitroBitacoraService},
  { provide: AplicacionCatGateway, useClass: AplicacionService},
  { provide: UsuarioCatGateway, useClass: UsuarioCatalogoService }

]
};



