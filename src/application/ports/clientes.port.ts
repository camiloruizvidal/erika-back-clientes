import {
  ICrearCliente,
  IClienteCreado,
} from '../../domain/interfaces/clientes.interface';

export interface IClientesService {
  crearCliente(payload: ICrearCliente): Promise<IClienteCreado>;
}
