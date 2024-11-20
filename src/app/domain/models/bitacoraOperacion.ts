export interface BitacoraOperacion
  {
    identificador: number;
    aplicativoId: string;
    capa: string;
    metodo: string;
    proceso: string;
    subproceso: string;
    detalleOperacion: string;
    transaccionId: string;
    ipEquipo: string;
    fechaHoraTransaccion: string;
    usuarioOperador: string;
    nombreOperador: string;
    expedienteOperador: string;
    rfcOperador: string;
    areaOperador: string;
    puestoOperador: string;
    estatusOperacion: string;
    respuestaOperacion: string;
}
