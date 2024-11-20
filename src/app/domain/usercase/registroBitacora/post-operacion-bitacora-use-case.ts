import { Injectable } from '@angular/core';
import { RegistroBitacoraGateway } from '../../models/gateway/registroBitacora.gateway';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PostOperacionBitacoraUseCase {

  //Implementa gateway de Registro de Bitácoras
  constructor(private _registroBitacoraGateway: RegistroBitacoraGateway) { }

  //Definición de metodos, que se crean a partir de las clases abstractas
  //Registra las operaciones en la Bitácora Centralizada
  postOperacionBitacoraData(metodo: string, proceso: string, subproceso: string, detalleOperacion: string, estatusOperacion: string, respuestaOperacion: string): Observable<any> {
    return this._registroBitacoraGateway.registroBitacoraOperaciones(metodo, proceso, subproceso, detalleOperacion, estatusOperacion, respuestaOperacion);
  }
}
