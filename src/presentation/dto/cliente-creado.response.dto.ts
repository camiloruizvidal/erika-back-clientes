import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TransformadoresDto } from '../utils/transformadores-dto.helper';

export class ClienteCreadoResponseDto {
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
  @Expose({ name: 'primerNombre' })
  primer_nombre!: string;

  @ApiProperty({
    description: 'Segundo nombre del cliente',
    type: String,
    nullable: true,
    example: 'Carlos',
  })
  @Expose({ name: 'segundoNombre' })
  segundo_nombre!: string | null;

  @ApiProperty({
    description: 'Primer apellido del cliente',
    type: String,
    example: 'Pérez',
  })
  @Expose({ name: 'primerApellido' })
  primer_apellido!: string;

  @ApiProperty({
    description: 'Segundo apellido del cliente',
    type: String,
    nullable: true,
    example: 'Gómez',
  })
  @Expose({ name: 'segundoApellido' })
  segundo_apellido!: string | null;

  @ApiProperty({
    description: 'Nombre completo del cliente',
    type: String,
    example: 'Juan Carlos Pérez Gómez',
  })
  @Expose({ name: 'nombreCompleto' })
  nombre_completo!: string;

  @ApiProperty({
    description: 'Identificador del tipo de documento',
    type: Number,
    example: 1,
  })
  @Transform(({ value }) =>
    value === null || value === undefined ? null : Number(value),
  )
  @Expose({ name: 'tipoDocumentoId' })
  tipo_documento_id!: number | null;

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
  @Transform(({ value }) => TransformadoresDto.transformarFecha(value))
  @Expose({ name: 'fechaNacimiento' })
  fecha_nacimiento!: Date | null;

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
