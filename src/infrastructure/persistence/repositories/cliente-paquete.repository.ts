import { Transaction } from 'sequelize';
import { Transformador } from '../../utils/transformador.util';
import { IClientePaquete } from '../interfaces/cliente-paquete.interface';
import { ClientePaqueteModel } from '../models/cliente-paquete.model';

interface ICrearClientePaquete {
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
  creadoUsuarioId: number;
}

export class ClientePaqueteRepository {
  static async buscarPorClienteYPaquete(
    clienteId: number,
    paqueteOriginalId: number,
  ): Promise<IClientePaquete | null> {
    const clientePaquete = await ClientePaqueteModel.findOne({
      where: {
        clienteId,
        paqueteOriginalId,
      },
    });
    return Transformador.extraerDataValues(clientePaquete);
  }

  static async crearClientePaquete(
    datos: ICrearClientePaquete,
    transaction: Transaction,
  ): Promise<IClientePaquete> {
    const clientePaquete = await ClientePaqueteModel.create(
      {
        tenantId: datos.tenantId,
        clienteId: datos.clienteId,
        paqueteOriginalId: datos.paqueteOriginalId,
        nombrePaquete: datos.nombrePaquete,
        descripcionPaquete: datos.descripcionPaquete,
        valorOriginal: datos.valorOriginal,
        valorAcordado: datos.valorAcordado,
        diaCobro: datos.diaCobro,
        diasGracia: datos.diasGracia,
        frecuenciaTipo: datos.frecuenciaTipo,
        frecuenciaValor: datos.frecuenciaValor,
        fechaInicio: datos.fechaInicio,
        fechaFin: datos.fechaFin,
        moraPorcentaje: datos.moraPorcentaje,
        moraValor: datos.moraValor,
        estado: datos.estado,
        creadoUsuarioId: datos.creadoUsuarioId,
      },
      { transaction },
    );
    return Transformador.extraerDataValues(clientePaquete);
  }
}
