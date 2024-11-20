import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AplicacionCatGateway } from '../../models/gateway/aplicacionCat.gateway';


@Injectable({
  providedIn: 'root'
})
export class DeleteAplicacionUseCase {

  //Implementa gateway del catálogo de Aplicaciones
  constructor(private _eliminaAplicacionGateWay: AplicacionCatGateway) { }

  //Definición de metodos, que se crean a partir de las clases abstractas
  //Elimina una aplicación del catálogo de Aplicaciones
  eliminaAplicacion(id: string): Observable<string> {
    return this._eliminaAplicacionGateWay.eliminaAplicacion(id);
  }
}
