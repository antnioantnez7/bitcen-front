import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioService } from '../../../../infrastructure/driven-adapter/usuario.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  //Se suscribe al evento, para ejecutar el comportamiento
  isLoggedIn$!: Observable<boolean>;

  //Uso de servicio y definición de variables
  usuarioService: UsuarioService = inject(UsuarioService);

  //Obtiene el valor de Logueo a través del observable
  ngOnInit() {
    this.isLoggedIn$ = this.usuarioService.isLoggedIn;
  }
}
