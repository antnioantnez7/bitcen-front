import { Usuario } from '../usuario';
import { Observable } from "rxjs";

export abstract class UsuarioCatGateway {

  //Interfaz de clases abstractas ("define el que")
  //Son definiciones del negocio
  //La capa de infraestructura(Service) extiende del gateway
  //Clases abstractas para el catálogo de Usuarios
  abstract consultaUsuarios(usuario: Usuario): Observable<Usuario>;
  abstract registraEditaUsuario(usuario: Usuario): Observable<string>;
  abstract eliminaUsuario(id: number): Observable<string>;
}
