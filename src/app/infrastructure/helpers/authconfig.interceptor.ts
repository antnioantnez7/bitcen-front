import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../enviroments/environment';


export const authconfigInterceptor: HttpInterceptorFn = (req, next) => {

  //Recupera los valores de usuario y password para encriptarlos
  let usuario = sessionStorage.getItem('usuario');
  let password = sessionStorage.getItem('password');

  //Valores que se van en el escabezado de las peticiones HTTP
  const authReq = req.clone({
    headers: req.headers
    .set('Access-Control-Allow-Origin', '*')
    .set('data', usuario + ' ' + password)
    .set('credentials',  `${sessionStorage.getItem('encode')}`)
    .set('token-auth', `${sessionStorage.getItem('token')}`)
    .set('app-name', environment.BITACORA_aplicativoId)
    .set('consumer-id', environment.BITACORA_consumerId)
    .set('functional-id', 'Login user')
    .set('transaction-id', `${sessionStorage.getItem('transaccion')}`)
    .set('time-refresh-token', '0')
  });
  return next(authReq).pipe(catchError((error) => {
     return throwError(() => error);
  }))
};
