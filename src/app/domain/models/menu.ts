export interface NavItem {
  nombreMenu: string;
  disabled: boolean;
  icono: string;
  url?: string;
  children?: NavItem[];
}

