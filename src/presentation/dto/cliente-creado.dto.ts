import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ClienteCreadoDto {
  @ApiProperty({
    description: 'Identificador generado para el cliente',
    type: Number,
    example: 21,
  })
  @Transform(({ value }) => Number(value))
  @Expose()
  id!: number;

  @ApiProperty({
    description: 'Primer nombre del cliente',
    type: String,
    example: 'Juan',
  })
  @Expose()
  primerNombre!: string;

  @ApiProperty({
    description: 'Segundo nombre del cliente',
    type: String,
    nullable: true,
    example: 'Carlos',
  })
  @Expose()
  segundoNombre!: string | null;

  @ApiProperty({
    description: 'Primer apellido del cliente',
    type: String,
    example: 'Pérez',
  })
  @Expose()
  primerApellido!: string;

  @ApiProperty({
    description: 'Segundo apellido del cliente',
    type: String,
    nullable: true,
    example: 'Gómez',
  })
  @Expose()
  segundoApellido!: string | null;

  @ApiProperty({
    description: 'Nombre completo del cliente',
    type: String,
    example: 'Juan Carlos Pérez Gómez',
  })
  @Expose()
  nombreCompleto!: string;

  @ApiProperty({
    description: 'Identificador del tipo de documento',
    type: Number,
    example: 1,
  })
  @Transform(({ value }) => Number(value))
  @Expose()
  tipoDocumentoId!: number;

  @ApiProperty({
    description: 'Correo electrónico del cliente',
    type: String,
    example: 'cliente@empresa.com',
  })
  @Expose()
  correo!: string;

  @ApiProperty({
    description: 'Número de contacto del cliente',
    type: String,
    nullable: true,
    example: '+57 3001234567',
  })
  @Expose()
  telefono!: string | null;

  @ApiProperty({
    description: 'Documento de identificación del cliente',
    type: String,
    nullable: true,
    example: 'CC-123456789',
  })
  @Expose()
  identificacion!: string | null;

  @ApiProperty({
    description: 'Fecha de nacimiento del cliente',
    type: String,
    format: 'date-time',
    nullable: true,
    example: '1990-05-20T00:00:00.000Z',
  })
  @Transform(({ value }) =>
    value === null || value === undefined ? null : new Date(value),
  )
  @Expose()
  fechaNacimiento!: Date | null;

  @ApiProperty({
    description: 'Dirección física registrada',
    type: String,
    nullable: true,
    example: 'Calle 123 #45-67, Bogotá',
  })
  @Expose()
  direccion!: string | null;

  @ApiProperty({
    description: 'Indica si el cliente está activo',
    type: Boolean,
    example: true,
  })
  @Expose()
  activo!: boolean;
}
