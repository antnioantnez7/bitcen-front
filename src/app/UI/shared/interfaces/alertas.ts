export class Alerta {
  type!: TipoAlerta;
  message!: string;
  texto!: string;
}

export enum TipoAlerta {
  success,
  info,
  warning,
  danger
}
