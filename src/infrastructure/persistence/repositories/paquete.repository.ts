import { Transformador } from '../../utils/transformador.util';
import { IPaquete } from '../interfaces/paquete.interface';
import { PaqueteModel } from '../models/paquete.model';

export class PaqueteRepository {
  static async buscarPorId(
    paqueteId: number,
    tenantId: number,
  ): Promise<IPaquete | null> {
    const paquete = await PaqueteModel.findOne({
      where: {
        id: paqueteId,
        tenantId,
      },
    });
    return Transformador.extraerDataValues(paquete);
  }
}
