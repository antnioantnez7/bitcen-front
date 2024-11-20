import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-modal-elimina-aplicacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-elimina-aplicacion.component.html',
  styleUrl: './modal-elimina-aplicacion.component.css'
})
export class ModalEliminaAplicacionComponent {

  //Obtiene la referencia del componente hijo
  @ViewChild('btnCloseModal', { static: true }) btnclosemodal!: ElementRef<HTMLButtonElement>;

  //Define una propiedad enviada por el componente padre
  @Input() titulo!: any;
  @Input() contenido!: any;
  @Input() titleButtonPrimary!: any;
  @Input() titleButtonSecondary!: any;
  @Input() isHidden!: boolean;
  @Output() propagar = new EventEmitter<boolean>();

  DoAction: boolean = false;

  constructor() { }

  //Emite el evento para cerrar modal
  EventDoIt() {
    this.DoAction = true;
    this.propagar.emit(this.DoAction);
    this.btnclosemodal.nativeElement.click();
  }
}

