import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { UsuarioGateway } from '../../domain/models/gateway/usuario.gateway';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroments/environment';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

//Extiende de las clases abstractas del usuario
export class UsuarioService extends UsuarioGateway {

  constructor(private router: Router, private httpclient: HttpClient) {
    super();
  }

  dateToday: any;
  datePipe = new DatePipe('en-US');

  //Define un observable para loggedIn
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private user: BehaviorSubject<string> = new BehaviorSubject<string>('');

  private loggedOut: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  get isLoggedOut() {
    return this.loggedOut.asObservable();
  }

  get isUser() {
    return this.user.asObservable();
  }

  //Encripta los datos de usuario y password que son enviados a LDAP
  encodeCredentials(): Observable<any> {
    return this.httpclient.post<any>(`${environment.SERVER_URL_SECURITY_AUTH}/security-auth/v1/encrypt/encode`, {});

  }

  //Verifica que el usuario esté activo en LDAP
  loginUserLDAP(): Observable<any> {
    return this.httpclient.post<any>(`${environment.SERVER_URL_SECURITY_AUTH}/security-auth/v1/ldap-user-pwd`, {});
  }

  //Recupera el Token si el usuario se encuentra activo en LDAP
  postToken(): Observable<any> {
    this.loggedIn.next(true);
    return this.httpclient.post<any>(`${environment.SERVER_URL_API_TOKENIZER}/tokenizer/v1/token`, {});
  }

  //Método que se ejecuta al salir de la aplicación
  logout() {

      sessionStorage.removeItem('token');
      sessionStorage.removeItem("encode");
      sessionStorage.removeItem("transaccion");
      sessionStorage.removeItem("dataLDAP");
      sessionStorage.removeItem("perfil");
      sessionStorage.removeItem("identificador");

        this.loggedIn.next(false);
        this.router.navigate(['login']);


  }

  login() {
    this.loggedIn.next(true);
  }

  //Ejecuta servicio para actualizar la sesión de un usuario en el Catálogo de Usuarios
  manejoSesion(identificador: number, sesion: string, fechaRegistro: string, fechaModifica: string): Observable<string> {
    return this.httpclient.post<string>(`${environment.SERVER_URL_BITACORA}/bitacora/catalogos/usuarios/guardar`, {
      'identificador': identificador,
      'usuario': "",
      'paterno': "",
      'materno': "",
      'nombre': "",
      'sesionActiva': sesion,
      'usuarioBloqueado': "",
      'intentosFallidos': 0,
      'usuarioRegistro': identificador,
      'fechaRegistro': fechaRegistro,
      'usuarioModifica': identificador,
      'fechaModifica': fechaModifica,
    });
  }
}
