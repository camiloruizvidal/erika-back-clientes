import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { Constantes } from '../../utils/constantes';

const transformarTexto = (valor: unknown): string | undefined => {
  if (valor === undefined || valor === null) {
    return undefined;
  }
  const texto = valor.toString().trim();
  return texto.length === 0 ? undefined : texto;
};

const transformarBooleano = (
  valor: string | number | boolean | null | undefined,
): boolean | undefined => {
  if (valor === undefined || valor === null || valor === '') {
    return undefined;
  }
  if (typeof valor === 'boolean') {
    return valor;
  }
  if (typeof valor === 'number') {
    return valor === 1;
  }
  const texto = valor.toString().toLowerCase();
  return texto === 'true' || texto === '1';
};

const transformarFecha = (valor: unknown): Date | undefined => {
  if (!valor) {
    return undefined;
  }
  const fecha = new Date(valor as string | number | Date);
  return Number.isNaN(fecha.getTime()) ? undefined : fecha;
};

export class CrearClienteDto {
  @ApiProperty({
    description: 'Primer nombre del cliente',
    example: 'Juan',
  })
  @Transform(({ value }) => transformarTexto(value))
  @IsString({ message: Constantes.PROPIEDAD_NO_PERMITIDA('primer_nombre') })
  @MinLength(2, { message: Constantes.LONGITUD_MINIMA('primer_nombre', 2) })
  @Expose({ name: 'primer_nombre' })
  primerNombre!: string;

  @ApiPropertyOptional({
    description: 'Segundo nombre del cliente',
    example: 'Carlos',
  })
  @IsOptional()
  @Transform(({ value }) => transformarTexto(value))
  @IsString({ message: Constantes.PROPIEDAD_NO_PERMITIDA('segundo_nombre') })
  @Expose({ name: 'segundo_nombre' })
  segundoNombre?: string;

  @ApiProperty({
    description: 'Primer apellido del cliente',
    example: 'Pérez',
  })
  @Transform(({ value }) => transformarTexto(value))
  @IsString({ message: Constantes.PROPIEDAD_NO_PERMITIDA('primer_apellido') })
  @MinLength(2, {
    message: Constantes.LONGITUD_MINIMA('primer_apellido', 2),
  })
  @Expose({ name: 'primer_apellido' })
  primerApellido!: string;

  @ApiPropertyOptional({
    description: 'Segundo apellido del cliente',
    example: 'Gómez',
  })
  @IsOptional()
  @Transform(({ value }) => transformarTexto(value))
  @IsString({ message: Constantes.PROPIEDAD_NO_PERMITIDA('segundo_apellido') })
  @Expose({ name: 'segundo_apellido' })
  segundoApellido?: string;

  @ApiProperty({
    description: 'Identificador del tipo de documento',
    example: 1,
  })
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }
    const numero = Number(value);
    return Number.isNaN(numero) ? undefined : numero;
  })
  @IsInt({ message: Constantes.PROPIEDAD_NO_PERMITIDA('tipo_documento_id') })
  @Min(1, { message: Constantes.VALOR_MINIMO('tipo_documento_id', 1) })
  @Expose({ name: 'tipo_documento_id' })
  tipoDocumentoId!: number;

  @ApiProperty({
    description: 'Correo electrónico único del cliente por tenant',
    example: 'cliente@empresa.com',
  })
  @Transform(({ value }) => transformarTexto(value)?.toLowerCase())
  @IsEmail({}, { message: Constantes.PROPIEDAD_NO_PERMITIDA('correo') })
  @Expose({ name: 'correo' })
  correo!: string;

  @ApiPropertyOptional({
    description: 'Número de contacto del cliente',
    example: '+57 3001234567',
  })
  @IsOptional()
  @Transform(({ value }) => transformarTexto(value))
  @IsString({ message: Constantes.PROPIEDAD_NO_PERMITIDA('telefono') })
  @Expose({ name: 'telefono' })
  telefono?: string;

  @ApiPropertyOptional({
    description: 'Documento de identificación del cliente',
    example: '123456789',
  })
  @IsOptional()
  @Transform(({ value }) => transformarTexto(value))
  @IsString({ message: Constantes.PROPIEDAD_NO_PERMITIDA('identificacion') })
  @Expose({ name: 'identificacion' })
  identificacion?: string;

  @ApiPropertyOptional({
    description: 'Fecha de nacimiento del cliente',
    example: '1990-05-20',
  })
  @IsOptional()
  @Transform(({ value }) => transformarFecha(value))
  @IsDate({ message: Constantes.PROPIEDAD_NO_PERMITIDA('fecha_nacimiento') })
  @Expose({ name: 'fecha_nacimiento' })
  fechaNacimiento?: Date;

  @ApiPropertyOptional({
    description: 'Dirección física del cliente',
    example: 'Calle 123 #45-67, Bogotá',
  })
  @IsOptional()
  @Transform(({ value }) => transformarTexto(value))
  @IsString({ message: Constantes.PROPIEDAD_NO_PERMITIDA('direccion') })
  @Expose({ name: 'direccion' })
  direccion?: string;

  @ApiPropertyOptional({
    description: 'Estado del cliente (activo/inactivo)',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => transformarBooleano(value))
  @IsBoolean({ message: Constantes.PROPIEDAD_NO_PERMITIDA('activo') })
  @Expose({ name: 'activo' })
  activo?: boolean;
}
