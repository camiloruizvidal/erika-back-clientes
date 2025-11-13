export interface ICliente {
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
  fechaNacimiento: Date | null;
  direccion: string | null;
  activo: boolean;
}
