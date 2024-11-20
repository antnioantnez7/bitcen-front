import { Aplicacion } from '../aplicacion';
import { Observable } from "rxjs";

export abstract class AplicacionCatGateway {

  //Interfaz de clases abstractas ("define el que")
  //Son definiciones del negocio
  //La capa de infraestructura(Service) extiende del gateway
  //Clases abstractas para el catálogo de Aplicaciones
  abstract consultaAplicaciones(): Observable<Aplicacion>;
  abstract registraAplicaciones(aplicaciones: Aplicacion): Observable<string>;
  abstract actualizaAplicaciones(aplicaciones: Aplicacion): Observable<string>;
  abstract eliminaAplicacion(id: string): Observable<string>;
}
