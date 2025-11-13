import { Op } from 'sequelize';
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
        returning: true,
      },
    );
    return Transformador.extraerDataValues<IClientePaqueteServicio[]>(
      registrosCreados,
    );
  }

  static async obtenerServiciosPorClientePaquete(
    clientePaqueteId: number,
  ): Promise<IClientePaqueteServicio[]> {
    const servicios = await ClientePaqueteServicioModel.findAll({
      where: {
        clientePaqueteId,
      },
    });
    return Transformador.extraerDataValues<IClientePaqueteServicio[]>(servicios);
  }

  static async eliminarServiciosAsignados(
    clientePaqueteId: number,
    serviciosOriginalesIds: number[],
  ): Promise<void> {
    if (serviciosOriginalesIds.length === 0) {
      return;
    }

    await ClientePaqueteServicioModel.destroy({
      where: {
        clientePaqueteId,
        servicioOriginalId: {
          [Op.in]: serviciosOriginalesIds,
        },
      },
    });
  }
}
