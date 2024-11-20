import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Alerta, TipoAlerta } from '../interfaces/alertas';

@Injectable({
  providedIn: 'root'
})

export class AlertasService {

  //Definición de variables y el Subject (tipo de Observable)
  private subject = new Subject<any>();
  private keepAfterRouteChange: boolean = false;
  private texto: string = "";


  //Se suscribe al evento del enrutador para eliminar los mensajes cuando hay un cambio de ruta
  constructor(private router: Router) {
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterRouteChange) {
          // conservar solo para un único cambio de ruta
          this.keepAfterRouteChange = false;
        } else {
          // limpia mensajes de alerta
          this.clear();
        }
      }
    });
  }

  //Permite la comunicación con los componentes que lo llaman
  getAlert(): Observable<any> {
    return this.subject.asObservable();
  }

  success(message: string, keepAfterRouteChange = false) {
    this.texto = "¡Felicidades!";
    this.alert(TipoAlerta.success, message, this.texto, keepAfterRouteChange);
  }

  danger(message: string, keepAfterRouteChange = false) {
    this.texto = "¡Error!";
    this.alert(TipoAlerta.danger, message, this.texto, keepAfterRouteChange);
  }

  info(message: string, keepAfterRouteChange = false) {
    this.texto = "¡Sugerencia!";
    this.alert(TipoAlerta.info, message, this.texto, keepAfterRouteChange);
  }

  warning(message: string, keepAfterRouteChange = false) {
    this.texto = "¡Precaución!";
    this.alert(TipoAlerta.warning, message, this.texto, keepAfterRouteChange);
  }

  //Envía el mensaje al observable, que después se envían a todos los suscriptores
  alert(type: TipoAlerta, message: string, texto: string, keepAfterRouteChange = false) {
    this.keepAfterRouteChange = keepAfterRouteChange;
    this.subject.next(<Alerta>{ type: type, message: message, texto: texto });
  }

  //Limpia los objetos creados
  clear() {
    this.subject.next(null);
  }


}
