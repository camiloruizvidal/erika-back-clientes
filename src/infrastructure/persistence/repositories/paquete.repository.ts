import { Transaction } from 'sequelize';
import { Transformador } from '../../utils/transformador.util';
import { IPaquete } from '../interfaces/paquete.interface';
import { PaqueteModel } from '../models/paquete.model';

export class PaqueteRepository {
  static async buscarPorId(
    paqueteId: number,
    tenantId: number,
    transaction?: Transaction,
  ): Promise<IPaquete | null> {
    const paquete = await PaqueteModel.findOne({
      where: {
        id: paqueteId,
        tenantId,
      },
      transaction,
    });
    return Transformador.extraerDataValues(paquete);
  }
}
