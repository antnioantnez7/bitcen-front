import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'app-paginacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paginacion.component.html',
  styleUrl: './paginacion.component.css'
})
export class PaginacionComponent {

  //Define una propiedad enviada por el componente padre
  @Input() totalItems!: any;
  @Input() currentPage!: any;
  @Input() itemsPerPage!: any;
  @Input() id!: any;
  @Input() pages: number[] = [];

  totalPages = 0;

  //Define una salida del componente, que el componente padre suscribe
  @Output() onClick: EventEmitter<number> = new EventEmitter();

  constructor() { }

  //Muestra la plantilla de paginación de acuerdo a los valores recibidos
  ngOnInit(): void {
     console.log("");
  }


  //Método que regresa un valor númerico al componente que lo llama
  pageClicked(value: number) {

    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    if (value > this.totalPages || value == 0) return;
    this.onClick.emit(value);

  }

}
