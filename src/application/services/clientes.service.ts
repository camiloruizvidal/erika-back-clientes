import { HttpStatus, Injectable } from '@nestjs/common';
import { IClientesService } from '../ports/clientes.port';
import {
  ICrearCliente,
  IClienteCreado,
} from '../../domain/interfaces/clientes.interface';
import { ClienteRepository } from '../../infrastructure/persistence/repositories/cliente.repository';
import { TipoDocumentoRepository } from '../../infrastructure/persistence/repositories/tipo-documento.repository';
import { ErrorPersonalizado } from '../../utils/error-personalizado/error-personalizado';
import { Constantes } from '../../utils/constantes';

@Injectable()
export class ClientesService implements IClientesService {
  public async crearCliente(payload: ICrearCliente): Promise<IClienteCreado> {
    const correoNormalizado = payload.correo.trim().toLowerCase();
    const primerNombre = payload.primerNombre.trim();
    const segundoNombre = payload.segundoNombre
      ? payload.segundoNombre.trim()
      : null;
    const primerApellido = payload.primerApellido.trim();
    const segundoApellido = payload.segundoApellido
      ? payload.segundoApellido.trim()
      : null;

    const clienteExistente = await ClienteRepository.buscarPorCorreo(
      payload.tenantId,
      correoNormalizado,
    );

    if (clienteExistente) {
      throw new ErrorPersonalizado(
        HttpStatus.CONFLICT,
        Constantes.CLIENTE_YA_EXISTE,
      );
    }

    const tipoDocumento = await TipoDocumentoRepository.buscarPorId(
      payload.tipoDocumentoId,
    );

    if (!tipoDocumento) {
      throw new ErrorPersonalizado(
        HttpStatus.NOT_FOUND,
        Constantes.TIPO_DOCUMENTO_NO_ENCONTRADO,
      );
    }

    const identificacionNormalizada = this.normalizarCampoOpcional(
      payload.identificacion,
    );

    const documentoDuplicado = await ClienteRepository.buscarPorDocumento(
      payload.tenantId,
      payload.tipoDocumentoId,
      identificacionNormalizada,
    );

    if (documentoDuplicado) {
      throw new ErrorPersonalizado(
        HttpStatus.CONFLICT,
        Constantes.CLIENTE_DOCUMENTO_YA_EXISTE,
      );
    }

    const nombreCompleto = this.construirNombreCompleto({
      primerNombre,
      segundoNombre,
      primerApellido,
      segundoApellido,
    });

    const fechaNacimiento = payload.fechaNacimiento ?? null;

    const clienteCreado = await ClienteRepository.crearCliente({
      tenantId: payload.tenantId,
      primerNombre,
      segundoNombre,
      primerApellido,
      segundoApellido,
      nombreCompleto,
      tipoDocumentoId: payload.tipoDocumentoId,
      correo: correoNormalizado,
      telefono: this.normalizarCampoOpcional(payload.telefono),
      identificacion: identificacionNormalizada,
      direccion: this.normalizarCampoOpcional(payload.direccion),
      fechaNacimiento,
      activo: payload.activo ?? true,
    });

    return {
      id: clienteCreado.id,
      primerNombre: clienteCreado.primerNombre,
      segundoNombre: clienteCreado.segundoNombre ?? null,
      primerApellido: clienteCreado.primerApellido,
      segundoApellido: clienteCreado.segundoApellido ?? null,
      nombreCompleto: clienteCreado.nombreCompleto,
      tipoDocumentoId: clienteCreado.tipoDocumentoId,
      correo: clienteCreado.correo,
      telefono: clienteCreado.telefono ?? null,
      identificacion: clienteCreado.identificacion ?? null,
      fechaNacimiento: clienteCreado.fechaNacimiento ?? null,
      direccion: clienteCreado.direccion ?? null,
      activo: clienteCreado.activo,
    };
  }

  private normalizarCampoOpcional(
    valor: string | null | undefined,
  ): string | null {
    if (!valor) {
      return null;
    }
    const texto = valor.trim();
    return texto.length > 0 ? texto : null;
  }

  private construirNombreCompleto(params: {
    primerNombre: string;
    segundoNombre: string | null;
    primerApellido: string;
    segundoApellido: string | null;
  }): string {
    const partes = [
      params.primerNombre,
      params.segundoNombre ?? '',
      params.primerApellido,
      params.segundoApellido ?? '',
    ]
      .map((parte) => (parte ?? '').trim())
      .filter((parte) => parte.length > 0);

    return partes.join(' ');
  }
}
