export interface ICrearCliente {
  tenantId: number;
  primerNombre: string;
  segundoNombre?: string | null;
  primerApellido: string;
  segundoApellido?: string | null;
  correo: string;
  tipoDocumentoId: number;
  telefono?: string | null;
  identificacion?: string | null;
  direccion?: string | null;
  fechaNacimiento?: Date | null;
  activo?: boolean;
}

export interface IClienteCreado {
  id: number;
  primerNombre: string;
  segundoNombre: string | null;
  primerApellido: string;
  segundoApellido: string | null;
  nombreCompleto: string;
  tipoDocumentoId: number;
  correo: string;
  telefono: string | null;
  identificacion: string | null;
  direccion: string | null;
  fechaNacimiento: Date | null;
  activo: boolean;
}
