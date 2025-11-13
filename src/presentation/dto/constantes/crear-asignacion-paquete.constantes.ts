import {
  ICrearAsignacionPaqueteFrequencies,
  EFrecuenciaTipo,
} from '../../../domain/interfaces/asignaciones.interface';

export const FRECUENCIAS_VALIDAS: ICrearAsignacionPaqueteFrequencies = [
  EFrecuenciaTipo.MENSUAL,
  EFrecuenciaTipo.SEMANAS,
  EFrecuenciaTipo.SERVICIOS,
];

