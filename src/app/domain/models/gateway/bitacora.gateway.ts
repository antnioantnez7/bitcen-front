import { Observable } from "rxjs";
import { BitacoraAcceso } from "../bitacoraAcceso";
import { BitacoraOperacion } from "../bitacoraOperacion";
import { BitacoraUsuario } from "../bitacoraUsuario";
import { BitacoraPerfiles } from "../bitacoraPerfiles";

export abstract class BitacoraGateway {

  //Interfaz de clases abstractas ("define el que")
  //Son definiciones del negocio
  //La capa de infraestructura(Service) extiende del gateway
  //Clases abstractas para la consulta de la Bitácora Centralizada
  abstract consultaAccesosBitacora(aplicativoId: string, fechaHoraIni: string, fechaHoraFin: string, historico: boolean): Observable<BitacoraAcceso>;
  abstract consultaOperacionesBitacora(aplicativoId: string, fechaHoraIni: string, fechaHoraFin: string, historico: boolean): Observable<BitacoraOperacion>;
  abstract consultaUsuariosBitacora(aplicativoId: string, procesoUsuarios: string, fechaHoraIni: string, fechaHoraFin: string, historico: boolean): Observable<BitacoraUsuario>;
  abstract consultaPerfilesBitacora(aplicativoId: string, procesoPerfiles: string, fechaHoraIni: string, fechaHoraFin: string, historico: boolean): Observable<BitacoraPerfiles>;
}
