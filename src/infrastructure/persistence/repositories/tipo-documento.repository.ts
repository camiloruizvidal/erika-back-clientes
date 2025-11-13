import { Transformador } from '../../utils/transformador.util';
import { ITipoDocumento } from '../interfaces/tipo-documento.interface';
import { TipoDocumentoModel } from '../models/tipo-documento.model';

export class TipoDocumentoRepository {
  static async buscarPorId(id: number): Promise<ITipoDocumento | null> {
    const tipoDocumento = await TipoDocumentoModel.findByPk(id);
    return Transformador.extraerDataValues(tipoDocumento);
  }
}
