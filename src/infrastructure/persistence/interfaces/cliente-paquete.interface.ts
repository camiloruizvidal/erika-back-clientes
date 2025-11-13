export interface IClientePaquete {
  id: number;
  tenantId: number;
  clienteId: number;
  paqueteOriginalId: number;
  nombrePaquete: string;
  descripcionPaquete: string | null;
  valorOriginal: number;
  valorAcordado: number;
  diaCobro: number | null;
  diasGracia: number | null;
  frecuenciaTipo: string;
  frecuenciaValor: number | null;
  fechaInicio: Date;
  fechaFin: Date | null;
  moraPorcentaje: number | null;
  moraValor: number | null;
  estado: string;
  creadoUsuarioId: number | null;
}

