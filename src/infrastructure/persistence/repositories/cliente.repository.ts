import { ClienteModel } from '../models/cliente.model';
import { ICrearCliente } from '../../../domain/interfaces/clientes.interface';

export class ClienteRepository {
  static async buscarPorCorreo(
    tenantId: number,
    correo: string,
  ): Promise<ClienteModel | null> {
    return ClienteModel.findOne({
      where: {
        tenantId,
        correo,
      },
    });
  }

  static async buscarPorDocumento(
    tenantId: number,
    tipoDocumentoId: number,
    identificacion: string | null,
  ): Promise<ClienteModel | null> {
    if (!identificacion) {
      return null;
    }

    return ClienteModel.findOne({
      where: {
        tenantId,
        tipoDocumentoId,
        identificacion,
      },
    });
  }

  static async crearCliente(
    datos: ICrearCliente & { nombreCompleto: string },
  ): Promise<ClienteModel> {
    return ClienteModel.create({
      tenantId: datos.tenantId,
      tipoDocumentoId: datos.tipoDocumentoId,
      primerNombre: datos.primerNombre,
      segundoNombre: datos.segundoNombre ?? null,
      primerApellido: datos.primerApellido,
      segundoApellido: datos.segundoApellido ?? null,
      nombreCompleto: datos.nombreCompleto,
      correo: datos.correo,
      telefono: datos.telefono ?? null,
      identificacion: datos.identificacion ?? null,
      fechaNacimiento: datos.fechaNacimiento ?? null,
      direccion: datos.direccion ?? null,
      activo: datos.activo ?? true,
    });
  }
}
