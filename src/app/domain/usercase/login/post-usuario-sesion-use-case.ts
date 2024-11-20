import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioCatGateway } from '../../models/gateway/usuariosCat.gateway';
import { UsuarioGateway } from '../../models/gateway/usuario.gateway';


@Injectable({
  providedIn: 'root'
})
export class PostUsuarioSesionUseCase {

  //Implementa gateway del catálogo de Usuarios
  constructor(private _actualizaSesionGateWay: UsuarioGateway) { }

  //Definición de metodos, que se crean a partir de las clases abstractas
  //Registra y/o Edita un usuario en el catálogo de Usuarios
  sesionUsuario(identificador: number, sesion: string, fechaRegistro: string, fechaModifica: string): Observable<string> {
    return this._actualizaSesionGateWay.manejoSesion(identificador, sesion, fechaRegistro, fechaModifica);
  }

}
