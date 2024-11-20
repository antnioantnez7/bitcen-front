import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AplicacionCatGateway } from '../../models/gateway/aplicacionCat.gateway';
import { Aplicacion } from '../../models/aplicacion';


@Injectable({
  providedIn: 'root'
})
export class GetAplicacionesConsultaUseCase {

  //Implementa gateway del catálogo de Aplicaciones
  constructor(private _consultaAplicacionGateway: AplicacionCatGateway) { }

  //Definición de metodos, que se crean a partir de las clases abstractas
  //Obtiene la consulta del catálogo de Aplicaciones
  consultaAplicaciones(): Observable<Aplicacion> {
    return this._consultaAplicacionGateway.consultaAplicaciones();
  }
}
