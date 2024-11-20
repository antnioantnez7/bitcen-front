import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AplicacionCatGateway } from '../../models/gateway/aplicacionCat.gateway';
import { Aplicacion } from '../../models/aplicacion';


@Injectable({
  providedIn: 'root'
})
export class PostAplicacionesActualizaUseCase {

  //Implementa gateway del catálogo de Aplicaciones
  constructor(private _actualizaAplicacionGateWay: AplicacionCatGateway) { }

  //Definición de metodos, que se crean a partir de las clases abstractas
  //Actualiza una aplicación del catálogo de Aplicaciones
  actualizaAplicaciones(aplicacion: Aplicacion): Observable<string> {
    return this._actualizaAplicacionGateWay.actualizaAplicaciones(aplicacion);
  }
}
