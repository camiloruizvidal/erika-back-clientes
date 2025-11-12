import { CrearClienteDto } from '../../presentation/dto/crear-cliente.dto';
import { ICrearCliente } from '../../domain/interfaces/clientes.interface';

export class ClientesMapper {
  static toInterface(dto: CrearClienteDto, tenantId: number): ICrearCliente {
    return {
      tenantId,
      primerNombre: dto.primerNombre.trim(),
      segundoNombre: dto.segundoNombre ?? null,
      primerApellido: dto.primerApellido.trim(),
      segundoApellido: dto.segundoApellido ?? null,
      correo: dto.correo.trim(),
      tipoDocumentoId: dto.tipoDocumentoId,
      telefono: dto.telefono ?? null,
      identificacion: dto.identificacion ?? null,
      direccion: dto.direccion ?? null,
      fechaNacimiento: dto.fechaNacimiento ?? null,
      activo: dto.activo ?? true,
    };
  }
}
