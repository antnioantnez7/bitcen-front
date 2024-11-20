export interface Usuario {
  identificador: number;
  usuario: string;
  paterno: string;
  materno: string;
  nombre: string;
  sesionActiva: string;
  usuarioBloqueado: string;
  intentosFallidos: number;
  usuarioRegistro: number;
  fechaRegistro: string;
  usuarioModifica: number;
  fechaModifica: string;
}
