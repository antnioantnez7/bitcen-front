import { Injectable } from '@angular/core';
import { RegistroBitacoraGateway } from '../../models/gateway/registroBitacora.gateway';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PostUsuarioBitacoraUseCase {

  //Implementa gateway de Registro de Bitácoras
  constructor(private _registroBitacoraGateway: RegistroBitacoraGateway) { }

  //Definición de metodos, que se crean a partir de las clases abstractas
  //Registra los movimientos de usuario en la Bitácora Centralizada
  postUsuarioBitacoraData(metodo: string, proceso: string, subproceso: string, detalleOperacion: string, estatusOperacion: string, respuestaOperacion: string): Observable<any> {
    return this._registroBitacoraGateway.registroBitacoraUsuarios(metodo, proceso, subproceso, detalleOperacion, estatusOperacion, respuestaOperacion);
  }
}
