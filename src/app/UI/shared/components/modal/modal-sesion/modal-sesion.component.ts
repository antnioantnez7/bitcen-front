import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-modal-sesion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-sesion.component.html',
  styleUrl: './modal-sesion.component.css'
})
export class ModalSesionComponent {

 //Define una propiedad enviada por el componente padre
  @Input() titulo!: any;
  @Input() contenido!: any;
  @Input() titleButtonPrimary!: any;
  @Input() titleButtonSecondary!: any;
  @Input() isHidden!: boolean;
}
