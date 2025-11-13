import { Transformador } from '../../utils/transformador.util';
import { PaqueteServicioModel } from '../models/paquete-servicio.model';
import { ServicioModel } from '../models/servicio.model';

export class PaqueteServicioRepository {
  static async obtenerServiciosPorPaquete(paqueteId: number): Promise<
    Array<{
      servicio: ServicioModel;
      relacion: PaqueteServicioModel;
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

    return relaciones.map((relacion) => ({
      servicio: Transformador.extraerDataValues(relacion.servicio),
      relacion: Transformador.extraerDataValues(relacion),
    }));
  }
}
