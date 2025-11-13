import { Transaction } from 'sequelize';
import { Transformador } from '../../utils/transformador.util';
import { IClientePaqueteServicio } from '../interfaces/cliente-paquete-servicio.interface';
import { ClientePaqueteServicioModel } from '../models/cliente-paquete-servicio.model';

interface ICrearServicioAsignado {
  tenantId: number;
  clientePaqueteId: number;
  servicioOriginalId: number;
  nombreServicio: string;
  valorOriginal: number;
  valorAcordado: number;
}

export class ClientePaqueteServicioRepository {
  static async crearServiciosAsignados(
    servicios: ICrearServicioAsignado[],
    transaction: Transaction,
  ): Promise<IClientePaqueteServicio[]> {
    const registros = servicios.map((servicio) => ({
      tenantId: servicio.tenantId,
      clientePaqueteId: servicio.clientePaqueteId,
      servicioOriginalId: servicio.servicioOriginalId,
      nombreServicio: servicio.nombreServicio,
      valorOriginal: servicio.valorOriginal,
      valorAcordado: servicio.valorAcordado,
    }));

    const registrosCreados = await ClientePaqueteServicioModel.bulkCreate(
      registros as Array<Partial<ClientePaqueteServicioModel>>,
      {
        transaction,
        returning: true,
      },
    );
    return Transformador.extraerDataValues(registrosCreados);
  }

  static async obtenerServiciosPorClientePaquete(
    clientePaqueteId: number,
  ): Promise<IClientePaqueteServicio[]> {
    const servicios = await ClientePaqueteServicioModel.findAll({
      where: {
        clientePaqueteId,
      },
    });
    return Transformador.extraerDataValues(servicios);
  }
}
