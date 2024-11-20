import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BitacoraGateway } from '../../models/gateway/bitacora.gateway';
import { BitacoraPerfiles } from '../../models/bitacoraPerfiles';

@Injectable({
  providedIn: 'root'
})
export class GetPerfilesBitacoraUseCase {

  //Implementa gateway de Bitácoras
  constructor(private _perfilesBitacoraGateWay: BitacoraGateway) { }

  //Definición de metodos, que se crean a partir de las clases abstractas
  //Obtiene la consulta de la Bitácora de Perfiles
  getPerfilesBitacoraData(aplicativoId: string, procesoPerfiles: string, fechaHoraIni: string, fechaHoraFin: string, historico: boolean): Observable<BitacoraPerfiles> {
    return this._perfilesBitacoraGateWay.consultaPerfilesBitacora(aplicativoId, procesoPerfiles, fechaHoraIni, fechaHoraFin, historico);
  }
}
