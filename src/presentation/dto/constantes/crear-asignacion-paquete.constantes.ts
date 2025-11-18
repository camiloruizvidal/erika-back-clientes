import { ICrearAsignacionPaqueteFrequencies } from '../../../domain/interfaces/asignaciones.interface';
import { EFrecuenciaTipo } from '../../../domain/enums/frecuencia-tipo.enum';

export const FRECUENCIAS_VALIDAS: ICrearAsignacionPaqueteFrequencies = [
  EFrecuenciaTipo.MENSUAL,
  EFrecuenciaTipo.SEMANAS,
  EFrecuenciaTipo.SERVICIOS,
];

