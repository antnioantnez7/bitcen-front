import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AplicacionCatGateway } from '../../models/gateway/aplicacionCat.gateway';
import { Aplicacion } from '../../models/aplicacion';


@Injectable({
  providedIn: 'root'
})
export class PostAplicacionesRegistroUseCase {

  //Implementa gateway del catálogo de Aplicaciones
  constructor(private _registraAplicacionGateWay: AplicacionCatGateway) { }

  //Definición de metodos, que se crean a partir de las clases abstractas
  //Registra una aplicación en el catálogo de Aplicaciones
  registraAplicaciones(aplicacion: Aplicacion): Observable<string> {
    return this._registraAplicacionGateWay.registraAplicaciones(aplicacion);
  }
}
