import { Injectable } from '@angular/core';
import { NavItem } from '../../domain/models/menu';

@Injectable({
  providedIn: 'root'
})
export class DatosMenuService {

  //Implementa los valores del menú de navegación
  protected menu: NavItem[] = [
    {
      nombreMenu: 'Consultas',
      disabled: false,
      icono: 'desktop_windows',
      url: 'bitacora',
    },
    {
      nombreMenu: 'Catálogos',
      disabled: false,
      icono: 'ballot',
      children: [
        {
          nombreMenu: 'Aplicaciones',
          disabled: false,
          icono: 'how_to_reg',
          url: '/aplicaciones'
        },
        {
          nombreMenu: 'Usuarios',
          disabled: false,
          icono: 'how_to_reg',
          url: '/usuarios'
        }
      ]
    }];

  //Obtiene los valores del menú
  getvaloresMenu(): NavItem[] {
    return this.menu;
  }
}
