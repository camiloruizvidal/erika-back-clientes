import { Transformador } from '../../utils/transformador.util';
import { ICrearCliente } from '../../../domain/interfaces/clientes.interface';
import { ClienteModel } from '../models/cliente.model';
import { ICliente } from '../interfaces/cliente.interface';
import { IResultadoFindAndCount } from '../../../shared/interfaces/sequelize-find.interface';

export class ClienteRepository {
  static async buscarPorCorreo(
    tenantId: number,
    correo: string,
  ): Promise<ICliente | null> {
    const cliente = await ClienteModel.findOne({
      where: {
        tenantId,
        correo,
      },
    });
    return Transformador.extraerDataValues(cliente);
  }

  static async buscarPorId(
    tenantId: number,
    clienteId: number,
  ): Promise<ICliente | null> {
    const cliente = await ClienteModel.findOne({
      where: {
        tenantId,
        id: clienteId,
      },
    });
    return Transformador.extraerDataValues(cliente);
  }

  static async buscarPorDocumento(
    tenantId: number,
    tipoDocumentoId: number,
    identificacion: string | null,
  ): Promise<ICliente | null> {
    if (!identificacion) {
      return null;
    }

    const cliente = await ClienteModel.findOne({
      where: {
        tenantId,
        tipoDocumentoId,
        identificacion,
      },
    });
    return Transformador.extraerDataValues(cliente);
  }

  static async crearCliente(
    datos: ICrearCliente & { nombreCompleto: string },
  ): Promise<ICliente> {
    const cliente = await ClienteModel.create({
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
    return Transformador.extraerDataValues(cliente);
  }

  static async listarPorTenant(
    tenantId: number,
    offset: number,
    limit: number,
  ): Promise<IResultadoFindAndCount<ICliente>> {
    const resultado = await ClienteModel.findAndCountAll({
      where: {
        tenantId,
      },
      offset,
      limit,
      order: [['created_at', 'DESC']],
    });

    return Transformador.extraerDataValues<IResultadoFindAndCount<ICliente>>(
      resultado,
    );
  }
}
