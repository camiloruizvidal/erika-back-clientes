export enum EFrecuenciaTipo {
  MENSUAL = 'mensual',
  SEMANAS = 'semanas',
  SERVICIOS = 'servicios',
}

// Creamos un tipo literal a partir del enum para restringir a los valores del enum.
export type FrecuenciaTipo = `${EFrecuenciaTipo}`;

export type ICrearAsignacionPaqueteFrequencies = FrecuenciaTipo[];

export interface IServicioAsignar {
  servicioId: number;
  valor?: number | null;
}

export interface IAsignarPaquete {
  paqueteId: number;
  valorPaquete?: number | null;
  diaCobro?: number | null;
  diasGracia?: number | null;
  frecuenciaTipo: FrecuenciaTipo;
  frecuenciaValor?: number | null;
  fechaInicio?: Date | null;
  fechaFin?: Date | null;
  moraPorcentaje?: number | null;
  moraValor?: number | null;
  creadoUsuarioId: number;
  servicios?: IServicioAsignar[] | null;
}

export interface IServicioAsignado {
  id: number;
  servicioOriginalId: number;
  nombreServicio: string;
  valorOriginal: number;
  valorAcordado: number;
}

export interface IAsignacionCreada {
  id: number;
  clienteId: number;
  paqueteOriginalId: number;
  nombrePaquete: string;
  valorOriginal: number;
  valorAcordado: number;
  diaCobro: number | null;
  diasGracia: number | null;
  frecuenciaTipo: FrecuenciaTipo;
  frecuenciaValor: number | null;
  fechaInicio: Date;
  fechaFin: Date | null;
  moraPorcentaje: number | null;
  moraValor: number | null;
  estado: string;
  servicios: IServicioAsignado[];
}
