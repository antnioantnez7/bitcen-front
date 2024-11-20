import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioCatGateway } from '../../models/gateway/usuariosCat.gateway';
import { Usuario } from '../../models/usuario';


@Injectable({
  providedIn: 'root'
})
export class PostUsuariosConsultaUseCase {

  //Implementa gateway del catálogo de Usuarios
  constructor(private _consultaUsuariosGateway: UsuarioCatGateway) { }

  //Definición de metodos, que se crean a partir de las clases abstractas
  //Consulta el catálogo de Usuarios
  consultaUsuarios(usuario: Usuario): Observable<Usuario> {
    return this._consultaUsuariosGateway.consultaUsuarios(usuario);
  }
}
