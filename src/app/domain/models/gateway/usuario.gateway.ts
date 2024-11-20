import { Observable } from "rxjs";

export abstract class UsuarioGateway {

  //Interfaz de clases abstractas ("define el que")
  //Son definiciones del negocio
  //La capa de infraestructura(Service) extiende del gateway
  //Clases abstractas para el Login del usuario
  abstract encodeCredentials(): Observable<any>;
  abstract loginUserLDAP(): Observable<any>;
  abstract postToken(): Observable<any>
  abstract manejoSesion(identificador: number, sesion: string, fechaRegistro: string, fechaModifica: string): Observable<string>;
}
