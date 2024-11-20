import { Observable } from "rxjs";

export abstract class RegistroBitacoraGateway {

  //Interfaz de clases abstractas ("define el que")
  //Son definiciones del negocio
  //La capa de infraestructura(Service) extiende del gateway
  //Clases abstractas para el registro en Bitácora Centralizada
  abstract registroBitacoraAcceso(metodo: string, actividad: string, estatusOperacion: string, respuestaOperacion: string): Observable<any>;
  abstract registroBitacoraOperaciones(metodo: string, proceso: string, subproceso: string, detalleOperacion: string, estatusOperacion: string, respuestaOperacion: string): Observable<any>;
  abstract registroBitacoraUsuarios(metodo: string, proceso: string, subproceso: string, detalleOperacion: string, estatusOperacion: string, respuestaOperacion: string): Observable<any>;
}
