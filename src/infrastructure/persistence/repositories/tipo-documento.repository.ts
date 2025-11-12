import { TipoDocumentoModel } from '../models/tipo-documento.model';

export class TipoDocumentoRepository {
  static async buscarPorId(id: number): Promise<TipoDocumentoModel | null> {
    return TipoDocumentoModel.findByPk(id);
  }
}
