import { Transformador } from '../../utils/transformador.util';
import { PaqueteServicioModel } from '../models/paquete-servicio.model';
import { ServicioModel } from '../models/servicio.model';

export class PaqueteServicioRepository {
  static async obtenerServiciosPorPaquete(paqueteId: number): Promise<
    Array<{
      servicio: {
        id: number;
        nombre: string;
        valor: number;
        tenantId: number;
      };
      [clave: string]: unknown;
    }>
  > {
    const relaciones = await PaqueteServicioModel.findAll({
      where: {
        paqueteId,
      },
      include: [
        {
          model: ServicioModel,
        },
      ],
    });

    return Transformador.extraerDataValues<
      Array<{
        servicio: {
          id: number;
          nombre: string;
          valor: number;
          tenantId: number;
        };
        [clave: string]: unknown;
      }>
    >(relaciones);
  }
}
