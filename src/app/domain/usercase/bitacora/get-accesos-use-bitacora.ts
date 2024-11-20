import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BitacoraGateway } from '../../models/gateway/bitacora.gateway';
import { BitacoraAcceso } from '../../models/bitacoraAcceso';


@Injectable({
  providedIn: 'root'
})
export class GetAccesosBitacoraUseCase {

  //Implementa gateway de Bitácoras
  constructor(private _accesosBitacoraGateWay: BitacoraGateway) { }

  //Definición de metodos, que se crean a partir de las clases abstractas
  //Obtiene la consulta de la Bitácora de Accesos
  getAccesosBitacoraData(aplicativoId: string, fechaHoraIni: string, fechaHoraFin: string, historico: boolean): Observable<BitacoraAcceso> {
    return this._accesosBitacoraGateWay.consultaAccesosBitacora(aplicativoId, fechaHoraIni, fechaHoraFin, historico);
  }
}
