import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioGateway } from '../../models/gateway/usuario.gateway';


@Injectable({
  providedIn: 'root'
})
export class PostTokenUseCase {

  //Hace uso del gateway Usuario
  constructor(private _tokenGateway: UsuarioGateway) { }

  //Método para obtener el token
  postToken(): Observable<any> {
    return this._tokenGateway.postToken();
  }

}


