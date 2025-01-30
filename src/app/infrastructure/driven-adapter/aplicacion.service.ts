import { Injectable } from '@angular/core';
import { AplicacionCatGateway } from '../../domain/models/gateway/aplicacionCat.gateway';
import { Observable } from 'rxjs';
import { Aplicacion } from '../../domain/models/aplicacion';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

//Extiende de las clases abstractas del Catálogo de Aplicaciones
export class AplicacionService extends AplicacionCatGateway {
  constructor(private httpclient: HttpClient) {
    super();
  }

  //Ejecuta servicio para la consulta del Catálogo de Aplicaciones
  consultaAplicaciones(): Observable<Aplicacion> {
    return this.httpclient.get<Aplicacion>(`${environment.SERVER_URL_BITACORA}/bitacora/catalogos/aplicativos/consultar`);
  }

  //Ejecuta servicio para registrar una Aplicación en el Catálogo de Apicaciones
  registraAplicaciones(aplicaciones: Aplicacion): Observable<string> {
    return this.httpclient.post<string>(`${environment.SERVER_URL_BITACORA}/bitacora/catalogos/aplicativos/registrar`, {
      'aplicativoId': aplicaciones.aplicativoId,
      'nombre': aplicaciones.nombre,
      'usuarioRegistro': aplicaciones.usuarioRegistro,
      'fechaRegistro': aplicaciones.fechaRegistro,
      'usuarioModifica': aplicaciones.usuarioModifica,
      'fechaModifica': aplicaciones.fechaModifica,
    });
  }

  //Ejecuta servicio para actualizar una Aplicación del Catálogo de Aplicaciones
  actualizaAplicaciones(aplicaciones: Aplicacion): Observable<string> {
    return this.httpclient.post<string>(`${environment.SERVER_URL_BITACORA}/bitacora/catalogos/aplicativos/actualizar`, {
      'aplicativoId': aplicaciones.aplicativoId,
      'nombre': aplicaciones.nombre,
      'usuarioRegistro': aplicaciones.usuarioRegistro,
      'fechaRegistro': aplicaciones.fechaRegistro,
      'usuarioModifica': aplicaciones.usuarioModifica,
      'fechaModifica': aplicaciones.fechaModifica,
    });
  }

  //Ejecuta servicio para eliminar una Aplicación del Catálogo de Aplicaciones
  eliminaAplicacion(id: string): Observable<string> {
    return this.httpclient.delete<string>(`${environment.SERVER_URL_BITACORA}/bitacora/catalogos/aplicativos/eliminar/` + id);
  }
}
