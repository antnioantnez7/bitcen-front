import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioCatGateway } from '../../models/gateway/usuariosCat.gateway';
import { Usuario } from '../../models/usuario';


@Injectable({
  providedIn: 'root'
})
export class PostUsuarioRegistroEdicionUseCase {

  //Implementa gateway del catálogo de Usuarios
  constructor(private _registraEditaUsuarioGateWay: UsuarioCatGateway) { }

  //Definición de metodos, que se crean a partir de las clases abstractas
  //Registra y/o Edita un usuario en el catálogo de Usuarios
  registraEditaUsuario(usuario: Usuario): Observable<string> {
    return this._registraEditaUsuarioGateWay.registraEditaUsuario(usuario);
  }

}
