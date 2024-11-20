import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { UsuarioCatGateway } from '../../models/gateway/usuariosCat.gateway';


@Injectable({
  providedIn: 'root'
})
export class DeleteUsuarioUseCase {

  //Implementa gateway del catálogo de Usuarios
  constructor(private _eliminaUsuarioGateWay: UsuarioCatGateway) { }

  //Definición de metodos, que se crean a partir de las clases abstractas
  //Elimina una usuario del catálogo de Usuarios
  eliminaUsuario(id: number): Observable<string> {
    return this._eliminaUsuarioGateWay.eliminaUsuario(id);
  }
}
