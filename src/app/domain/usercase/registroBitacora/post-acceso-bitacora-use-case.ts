import { Injectable } from '@angular/core';
import { RegistroBitacoraGateway } from '../../models/gateway/registroBitacora.gateway';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostAccesoBitacoraUseCase {

  //Implementa gateway de Registro de Bitácoras
  constructor(private _registroBitacoraGateway: RegistroBitacoraGateway) { }

  //Definición de metodos, que se crean a partir de las clases abstractas
  //Registra el acceso en la Bitácora Centralizada
  postAccesoBitacoraData(metodo: string, actividad: string, estatusOperacion: string, respuestaOperacion: string ): Observable<any> {
    return this._registroBitacoraGateway.registroBitacoraAcceso(metodo, actividad, estatusOperacion, respuestaOperacion);
  }
}
