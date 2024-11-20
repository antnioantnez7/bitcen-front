import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BitacoraUsuario } from '../../models/bitacoraUsuario';
import { BitacoraGateway } from '../../models/gateway/bitacora.gateway';

@Injectable({
  providedIn: 'root'
})
export class GetUsuariosBitacoraUseCase {

  //Implementa gateway de Bitácoras
  constructor(private _usuariosBitacoraGateWay: BitacoraGateway) { }

  //Definición de metodos, que se crean a partir de las clases abstractas
  //Obtiene la consulta de la Bitácora de Usuarios
  getUsuariosBitacoraData(aplicativoId: string, procesoUsuarios: string, fechaHoraIni: string, fechaHoraFin: string, historico: boolean): Observable<BitacoraUsuario> {
    return this._usuariosBitacoraGateWay.consultaUsuariosBitacora(aplicativoId, procesoUsuarios,  fechaHoraIni, fechaHoraFin, historico);
  }
}
