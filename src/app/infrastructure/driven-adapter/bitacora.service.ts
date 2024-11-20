import { Injectable } from '@angular/core';
import { BitacoraGateway } from '../../domain/models/gateway/bitacora.gateway';
import { Observable } from 'rxjs';
import { BitacoraAcceso } from '../../domain/models/bitacoraAcceso';
import { BitacoraOperacion } from '../../domain/models/bitacoraOperacion';
import { BitacoraUsuario } from '../../domain/models/bitacoraUsuario';
import { environment } from './../../../enviroments/environment';
import { HttpClient } from '@angular/common/http';
import { BitacoraPerfiles } from '../../domain/models/bitacoraPerfiles';

@Injectable({
  providedIn: 'root'
})

//Extiende de las clases abstractas de Consulta de Bitácoras
export class BitacoraService extends BitacoraGateway {

  constructor(private httpclient: HttpClient) {
    super();
  }

  //Ejecuta servicio para consultar la bitácora de Accesos
  consultaAccesosBitacora(aplicativoId: string, fechaHoraIni: string, fechaHoraFin: string, historico: boolean): Observable<BitacoraAcceso> {
    return this.httpclient.post<BitacoraAcceso>(`${environment.SERVER_URL_BITACORA}/bitacora/accesos/consultar`, { aplicativoId: aplicativoId, fechaHoraIni: fechaHoraIni, fechaHoraFin: fechaHoraFin, historico: historico });
  }

   //Ejecuta servicio para consultar la bitácora de Operaciones
  consultaOperacionesBitacora(aplicativoId: string, fechaHoraIni: string, fechaHoraFin: string, historico: boolean): Observable<BitacoraOperacion> {
    return this.httpclient.post<BitacoraOperacion>(`${environment.SERVER_URL_BITACORA}/bitacora/operaciones/consultar`, { aplicativoId: aplicativoId, fechaHoraIni: fechaHoraIni, fechaHoraFin: fechaHoraFin, historico: historico });
  }

   //Ejecuta servicio para consultar la bitácora de Usuarios
  consultaUsuariosBitacora(aplicativoId: string, procesoUsuario: string, fechaHoraIni: string, fechaHoraFin: string, historico: boolean): Observable<BitacoraUsuario> {
    return this.httpclient.post<BitacoraUsuario>(`${environment.SERVER_URL_BITACORA}/bitacora/usuarios/consultar`, { aplicativoId: aplicativoId, proceso: procesoUsuario,  fechaHoraIni: fechaHoraIni, fechaHoraFin: fechaHoraFin, historico: historico });
  }

  //Ejecuta servicio para consultar la bitácora de Perfiles
  consultaPerfilesBitacora(aplicativoId: string, procesoPerfiles: string, fechaHoraIni: string, fechaHoraFin: string, historico: boolean): Observable<BitacoraPerfiles> {
    return this.httpclient.post<BitacoraPerfiles>(`${environment.SERVER_URL_BITACORA}/bitacora/usuarios/consultar`, { aplicativoId: aplicativoId, proceso: procesoPerfiles, fechaHoraIni: fechaHoraIni, fechaHoraFin: fechaHoraFin, historico: historico });
  }
}
