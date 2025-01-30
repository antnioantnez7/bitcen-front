import { Injectable } from '@angular/core';
import { RegistroBitacoraGateway } from '../../domain/models/gateway/registroBitacora.gateway';
import { Observable } from 'rxjs';
import { BitacoraAcceso } from '../../domain/models/bitacoraAcceso';
import { BitacoraOperacion } from '../../domain/models/bitacoraOperacion';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { BitacoraUsuario } from '../../domain/models/bitacoraUsuario';
import * as publicIp from 'public-ip';


@Injectable({
  providedIn: 'root'
})

//Extiende de las clases abstractas para el registro en Bitácora Centralizada
export class RegitroBitacoraService extends RegistroBitacoraGateway {

  ip: string = "";
  dataUser: any;
  datePipe = new DatePipe('en-US');
  dateToday: any;

  //Modelo de Bitácora Acceso
  accesos: BitacoraAcceso = {
    'identificador': Number(environment.BITACORA_identificador),
    'aplicativoId': environment.BITACORA_aplicativoId,
    'capa': environment.BITACORA_capa,
    'metodo': '',
    'actividad': '',
    'transaccionId': `${sessionStorage.getItem('transaccion')}`,
    'ipEquipo': this.ip,
    'fechaHoraAcceso': "",
    'usuarioAcceso': `${sessionStorage.getItem(('usuario'))}`,
    'nombreUsuario': '',
    'expedienteUsuario': '',
    'rfcUsuario': '',
    'areaUsuario': '',
    'puestoUsuario': '',
    'estatusOperacion': '',
    'respuestaOperacion': ''
  }

  //Modelo de Bitácora Operacion
  operaciones: BitacoraOperacion = {
    'identificador': Number(environment.BITACORA_identificador),
    'aplicativoId': environment.BITACORA_aplicativoId,
    'capa': environment.BITACORA_capa,
    'metodo': '',
    'proceso': '',
    'subproceso': '',
    'detalleOperacion': '',
    'transaccionId': `${sessionStorage.getItem('transaccion')}`,
    'ipEquipo': this.ip,
    'fechaHoraTransaccion': "",
    'usuarioOperador': `${sessionStorage.getItem(('usuario'))}`,
    'nombreOperador': '',
    'expedienteOperador': '',
    'rfcOperador': '',
    'areaOperador': '',
    'puestoOperador': '',
    'estatusOperacion': '',
    'respuestaOperacion': ''
  }

  //Modelo de Bitácora de Usuario
  usuarios: BitacoraUsuario = {
    'identificador': Number(environment.BITACORA_identificador),
    'aplicativoId': environment.BITACORA_aplicativoId,
    'capa': environment.BITACORA_capa,
    'metodo': "",
    'proceso': "",
    'subproceso': "",
    'detalleOperacion': "",
    'transaccionId': `${sessionStorage.getItem('transaccion')}`,
    'ipEquipo': this.ip,
    'fechaHoraOperacion': '',
    'usuarioOperador': `${sessionStorage.getItem(('usuario'))}`,
    'nombreOperador': "",
    'expedienteOperador': "",
    'rfcOperador': '',
    'areaOperador': "",
    'puestoOperador': "",
    'usuario': "",
    'nombreUsuario': "",
    'expedienteUsuario': "",
    'rfcUsuario': '',
    'areaUsuario': "",
    'puestoUsuario': "",
    'estatusOperacion': "",
    'respuestaOperacion': "",
  }


  constructor(private httpclient: HttpClient) {
    super();

    publicIp.publicIpv4().then((ip) => {
      this.ip = ip;
    })
  }

  //Método para registrar la bitácora de acceso
  registroBitacoraAcceso(metodo: string, actividad: string, estatusOperacion: string, respuestaOperacion: string): Observable<any> {

    if (estatusOperacion != 'I') {
      //Recupera los datos de LDAP
      this.dataUser = JSON.parse(sessionStorage.getItem('dataLDAP')!);
      JSON.parse(sessionStorage.getItem('dataLDAP')!, (key, value) => {
        if (key === 'nombre') {
          this.accesos.nombreUsuario = value;
        }
        if (key === 'expediente') {
          this.accesos.expedienteUsuario = value;
        }
        if (key === 'area') {
          this.accesos.areaUsuario = value;
        }
        if (key === 'puesto') {
          this.accesos.puestoUsuario = value;
        }
        if (key === 'usuario') {
          this.accesos.usuarioAcceso = value;
        }

      });
    } else {

        this.accesos.nombreUsuario = "";
        this.accesos.expedienteUsuario = "";
        this.accesos.areaUsuario = "";
        this.accesos.puestoUsuario = "";
        this.accesos.usuarioAcceso = "";
    }


    //Obtiene la fecha del día para registrar en la bitácora de Accesos
    this.dateToday = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss.SSS');


    //Ejecuta el apirest de accesos/registrar
    return this.httpclient.post<any>(`${environment.SERVER_URL_BITACORA}/bitacora/accesos/registrar`, {
      //return this.httpclient.post<any>(`/bitacora/accesos/registrar`, {
      'identificador': this.accesos.identificador,
      'aplicativoId': this.accesos.aplicativoId,
      'capa': this.accesos.capa,
      'metodo': metodo,
      'actividad': actividad,
      'transaccionId': `${sessionStorage.getItem('transaccion')}`,
      'ipEquipo': this.ip,
      'fechaHoraAcceso': this.dateToday + 'Z',
      'usuarioAcceso': `${sessionStorage.getItem(('usuario'))}`,
      'nombreUsuario': this.accesos.nombreUsuario,
      'expedienteUsuario': this.accesos.expedienteUsuario,
      'rfcUsuario': this.accesos.rfcUsuario,
      'areaUsuario': this.accesos.areaUsuario,
      'puestoUsuario': this.accesos.puestoUsuario,
      'estatusOperacion': estatusOperacion,
      'respuestaOperacion': respuestaOperacion
    });
  }

  //Método para registra la bitácora de operaciones
  registroBitacoraOperaciones(metodo: string, proceso: string, subproceso: string, detalleOperacion: string, estatusOperacion: string, respuestaOperacion: string): Observable<any> {

    this.dataUser = JSON.parse(sessionStorage.getItem('dataLDAP')!);
    JSON.parse(sessionStorage.getItem('dataLDAP')!, (key, value) => {
      if (key === 'nombre') {
        this.operaciones.nombreOperador = value;
      }
      if (key === 'expediente') {
        this.operaciones.expedienteOperador = value;
      }
      if (key === 'area') {
        this.operaciones.areaOperador = value;
      }
      if (key === 'puesto') {
        this.operaciones.puestoOperador = value;
      }
      if (key === 'usuario') {
        this.operaciones.usuarioOperador = value;
      }

    });


    //Obtiene la fecha del día para registrar en la bitácora de Operaciones
    this.dateToday = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss.SSS');

    return this.httpclient.post<any>(`${environment.SERVER_URL_BITACORA}/bitacora/operaciones/registrar`, {
      //return this.httpclient.post<any>(`/bitacora/operaciones/registrar`, {
      "identificador": this.operaciones.identificador,
      "aplicativoId": this.operaciones.aplicativoId,
      "capa": this.operaciones.capa,
      "metodo": metodo,
      "proceso": proceso,
      "subproceso": subproceso,
      "detalleOperacion": detalleOperacion,
      "transaccionId": `${sessionStorage.getItem('transaccion')}`,
      "ipEquipo": this.ip,
      "fechaHoraTransaccion": this.dateToday + 'Z',
      "usuarioOperador": this.operaciones.usuarioOperador,
      "nombreOperador": this.operaciones.nombreOperador,
      "expedienteOperador": this.operaciones.expedienteOperador,
      "rfcOperador": this.operaciones.rfcOperador,
      "areaOperador": this.operaciones.areaOperador,
      "puestoOperador": this.operaciones.puestoOperador,
      "estatusOperacion": estatusOperacion,
      "respuestaOperacion": respuestaOperacion
    });
  }

  //Método para registrar en el bitácora de usuarios
  registroBitacoraUsuarios(metodo: string, proceso: string, subproceso: string, detalleOperacion: string, estatusOperacion: string, respuestaOperacion: string): Observable<any> {

    this.dataUser = JSON.parse(sessionStorage.getItem('dataLDAP')!);
    JSON.parse(sessionStorage.getItem('dataLDAP')!, (key, value) => {
      if (key === 'nombre') {
        this.usuarios.nombreOperador = value;
      }
      if (key === 'expediente') {
        this.usuarios.expedienteOperador = value;
      }
      if (key === 'area') {
        this.usuarios.areaOperador = value;
      }
      if (key === 'puesto') {
        this.usuarios.puestoOperador = value;
      }
      if (key === 'usuario') {
        this.usuarios.usuarioOperador = value;
      }

    });

    //Obtiene la fecha del día para registrar en la bitácora de Usuarios
    this.dateToday = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss.SSS');
    return this.httpclient.post<any>(`${environment.SERVER_URL_BITACORA}/bitacora/usuarios/registrar`, {
      //return this.httpclient.post<any>(`/persistence/usuarios/registrar`, {
      "identificador": this.usuarios.identificador,
      "aplicativoId": this.usuarios.aplicativoId,
      "capa": this.usuarios.capa,
      "metodo": metodo,
      "proceso": proceso,
      "subproceso": subproceso,
      "detalleOperacion": detalleOperacion,
      "transaccionId": `${sessionStorage.getItem('transaccion')}`,
      "ipEquipo": this.ip,
      "fechaHoraOperacion": this.dateToday + 'Z',
      "usuarioOperador": this.usuarios.usuarioOperador,
      "nombreOperador": this.usuarios.nombreOperador,
      "expedienteOperador": this.usuarios.expedienteOperador,
      "rfcOperador": this.usuarios.rfcOperador,
      "areaOperador": this.usuarios.areaOperador,
      "puestoOperador": this.usuarios.puestoOperador,
      "usuario": "string",
      "nombreUsuario": "string",
      "expedienteUsuario": "string",
      "rfcUsuario": this.usuarios.rfcUsuario,
      "areaUsuario": "string",
      "puestoUsuario": "string",
      "estatusOperacion": estatusOperacion,
      "respuestaOperacion": respuestaOperacion
    });
  }

}
