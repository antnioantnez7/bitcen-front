import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BitacoraOperacion } from '../../models/bitacoraOperacion';
import { BitacoraGateway } from '../../models/gateway/bitacora.gateway';



@Injectable({
  providedIn: 'root'
})
export class GetOperacionesBitacoraUseCase {

  //Implementa gateway de Bitácoras
  constructor(private _operacionesBitacoraGateWay: BitacoraGateway) { }

  //Definición de metodos, que se crean a partir de las clases abstractas
  //Obtiene la consulta de la Bitácora de Operaciones
  getOperacionesBitacoraData(aplicativoId: string, fechaHoraIni: string,fechaHoraFin:string,historico:boolean): Observable<BitacoraOperacion> {
    return this._operacionesBitacoraGateWay.consultaOperacionesBitacora(aplicativoId,fechaHoraIni,fechaHoraFin,historico);
  }
}
