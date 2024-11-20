import { Component } from '@angular/core';
import { AlertasService } from '../../services/alertas.service';
import { Alerta, TipoAlerta } from '../../interfaces/alertas';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alertas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alertas.component.html',
  styleUrl: './alertas.component.css'
})
export class AlertasComponent {

  //Definición de variables
  alertas: Alerta[] = [];

  //Instancia de servicio
  constructor(private alertaServicio: AlertasService) { }

  //Método que se suscribe al observable devuelto desde el servicio
  //Permite que el componente de alerta sea notificado cuando un mensaje de alerta se envía al servicio
  //lo agerga al array de alertas que se muestran.
  ngOnInit() {
    this.alertaServicio.getAlert().subscribe((alerta: Alerta) => {
      if (!alerta) {
        // borra alertas cuando se recibe una alerta vacía
        this.alertas = [];
        return;
      }

      // Agrega alerta a l array
      this.alertas.push(alerta);
    });
  }


  // Devuelve la clase CSS basada en el tipo de alerta
  cssClass(alerta: Alerta) {
    if (!alerta) {
      return;
    }

    switch (alerta.type) {
      case TipoAlerta.success:
        return 'alert alert-success';
      case TipoAlerta.danger:
        return 'alert alert-danger';
      case TipoAlerta.info:
        return 'alert alert-info';
      case TipoAlerta.warning:
        return 'alert alert-warning';
    }
  }

}
