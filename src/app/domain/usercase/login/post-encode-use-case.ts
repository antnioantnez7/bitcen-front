import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioGateway } from '../../models/gateway/usuario.gateway';
@Injectable({
  providedIn: 'root'
})
export class PostCredentialsUseCase {

  //Hace uso del gateway de Usuario
  constructor(private _userGateway: UsuarioGateway) { }

  //Método para encriptar las credenciales
  postEncode(): Observable<any> {
    return this._userGateway.encodeCredentials();
 }

}
