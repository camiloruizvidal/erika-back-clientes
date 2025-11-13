import {
  ICrearCliente,
  IClienteCreado,
} from '../../domain/interfaces/clientes.interface';
import { IPaginado } from '../../shared/interfaces/paginado.interface';
import { ICliente } from '../../infrastructure/persistence/interfaces/cliente.interface';

export interface IClientesService {
  crearCliente(payload: ICrearCliente): Promise<IClienteCreado>;
  listarClientes(
    tenantId: number,
    pagina: number,
    tamanoPagina: number,
  ): Promise<IPaginado<ICliente>>;
}
