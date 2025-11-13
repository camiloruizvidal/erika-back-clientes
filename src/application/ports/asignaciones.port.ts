import {
  IAsignarPaquete,
  IAsignacionCreada,
} from '../../domain/interfaces/asignaciones.interface';

export interface IAsignacionesService {
  asignarPaqueteACliente(
    tenantId: number,
    clienteId: number,
    payload: IAsignarPaquete,
  ): Promise<IAsignacionCreada>;
}
