import { Component, Input } from '@angular/core';
import { PaginacionComponent } from '../../shared/components/paginacion/paginacion.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchPipe } from '../../shared/services/pipe/search.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { BitacoraAcceso } from '../../../domain/models/bitacoraAcceso';

@Component({
  selector: 'app-tabla-accesos',
  standalone: true,
  imports: [PaginacionComponent, CommonModule, FormsModule, SearchPipe, NgxPaginationModule],
  templateUrl: './tabla-accesos.component.html',
  styleUrl: './tabla-accesos.component.css'
})

export class TablaAccesosComponent {

  //Valores de paginación de la tabla
  currentPage: number = 1;
  page = 1;
  //Ordenamiento de la tabla
  sortColumn: string = '';
  sortAscending: boolean = true;

  //Define una propiedad enviada por el componente padre
  @Input() titulos: any;
  @Input() filas: any;
  @Input() exportFile: any;
  @Input() searchText: any
  @Input() totalItems: any;
  @Input() itemsPerPage: any;

  constructor() { }

  handlePageChange(event: any) {
    this.page = event;
  }

  //Ordena por columnas
  sortData(column: keyof BitacoraAcceso): void {
    if (this.sortColumn === column) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortColumn = column;
      this.sortAscending = true;
    }

    this.filas.sort((a: any, b: any) => {
      if (a[column] < b[column]) {
        return this.sortAscending ? -1 : 1;
      } else if (a[column] > b[column]) {
        return this.sortAscending ? 1 : -1;
      } else {
        return 0;
      }
    });
  }
}
