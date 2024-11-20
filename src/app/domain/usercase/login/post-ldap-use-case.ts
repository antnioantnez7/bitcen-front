import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioGateway } from '../../models/gateway/usuario.gateway';


@Injectable({
  providedIn: 'root'
})
export class PostLDAPUseCase {

  //Hace uso del gateway Usuario
  constructor(private _userGateway: UsuarioGateway) { }

  //Método para consultar al usuario en LDAP
  postloginUserLDAP(): Observable<any> {
    return this._userGateway.loginUserLDAP();
  }

}
