import { Injectable } from '@angular/core';
import { UsuarioCatGateway } from '../../domain/models/gateway/usuariosCat.gateway';
import { Observable } from 'rxjs';
import { Usuario } from '../../domain/models/usuario';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroments/environment';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

//Extiende de las clases abstractas del Catálogo de Usuarios
export class UsuarioCatalogoService extends UsuarioCatGateway {

  datePipe = new DatePipe('en-US');
  dateToday: any;

  constructor(private httpclient: HttpClient) {
    super();
  }

  //Ejecuta servicio para la consulta del Catálogo de Usuarios
  consultaUsuarios(usuario: Usuario): Observable<any> {

    //Obtiene la fecha del día para registrar en la bitácora de Accesos
    this.dateToday = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss.SSS');

    return this.httpclient.post<Usuario>(`${environment.SERVER_URL_BITACORA}/bitacora/catalogos/usuarios/consultar`, {
      'identificador': usuario.identificador,
      'usuario': usuario.usuario,
      'paterno': usuario.paterno,
      'materno': usuario.materno,
      'nombre': usuario.nombre,
      'fechaRegistro': this.dateToday,
      'fechaModifica': this.dateToday,

    });
  }

  //Ejecuta servicio para registrar/editar un usuario en el Catálogo de Usuarios
  registraEditaUsuario(usuario: Usuario): Observable<string> {
    return this.httpclient.post<string>(`${environment.SERVER_URL_BITACORA}/bitacora/catalogos/usuarios/guardar`, {
      'identificador': usuario.identificador,
      'usuario': usuario.usuario,
      'paterno': usuario.paterno,
      'materno': usuario.materno,
      'nombre': usuario.nombre,
      'sesionActiva': usuario.sesionActiva,
      'usuarioBloqueado': usuario.usuarioBloqueado,
      'intentosFallidos': usuario.intentosFallidos,
      'usuarioRegistro': usuario.usuarioRegistro,
      'fechaRegistro': usuario.fechaRegistro,
      'usuarioModifica': usuario.usuarioModifica,
      'fechaModifica': usuario.fechaModifica,
    });
  }

  //Ejecuta servicio para eliminar un usuario del Catálogo de Usuarios
  eliminaUsuario(id: number): Observable<string> {
    return this.httpclient.delete<string>(`${environment.SERVER_URL_BITACORA}/bitacora/catalogos/usuarios/eliminar/` + id);
  }
}
