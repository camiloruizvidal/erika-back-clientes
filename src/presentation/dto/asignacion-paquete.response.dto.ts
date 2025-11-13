import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { ServicioAsignadoResponseDto } from './servicio-asignado.response.dto';

export class AsignacionPaqueteResponseDto {
  @ApiProperty({
    description: 'Identificador de la asignación creada',
    type: Number,
    example: 25,
  })
  @Transform(({ value }) => Number(value))
  @Expose()
  id!: number;

  @ApiProperty({
    description: 'Identificador del cliente',
    type: Number,
    example: 8,
  })
  @Transform(({ value }) => Number(value))
  @Expose()
  clienteId!: number;

  @ApiProperty({
    description: 'Identificador del paquete original',
    type: Number,
    example: 5,
  })
  @Transform(({ value }) => Number(value))
  @Expose()
  paqueteOriginalId!: number;

  @ApiProperty({
    description: 'Nombre del paquete copiado',
    type: String,
    example: 'Clases de inglés intensivas',
  })
  @Expose()
  nombrePaquete!: string;

  @ApiProperty({
    description: 'Valor original del paquete',
    type: Number,
    example: 220000,
  })
  @Transform(({ value }) => Number(value))
  @Expose()
  valorOriginal!: number;

  @ApiProperty({
    description: 'Valor acordado para el cliente',
    type: Number,
    example: 200000,
  })
  @Transform(({ value }) => Number(value))
  @Expose()
  valorAcordado!: number;

  @ApiProperty({
    description: 'Día del cobro (solo para frecuencia mensual)',
    type: Number,
    nullable: true,
    example: 15,
  })
  @Expose()
  diaCobro!: number | null;

  @ApiProperty({
    description: 'Días de gracia antes de aplicar mora',
    type: Number,
    nullable: true,
    example: 4,
  })
  @Expose()
  diasGracia!: number | null;

  @ApiProperty({
    description: 'Tipo de frecuencia: mensual, semanas o servicios',
    type: String,
    example: 'mensual',
  })
  @Expose()
  frecuenciaTipo!: string;

  @ApiProperty({
    description:
      'Valor de la frecuencia (semanas o servicios). Nulo para frecuencia mensual.',
    type: Number,
    nullable: true,
    example: 5,
  })
  @Expose()
  frecuenciaValor!: number | null;

  @ApiProperty({
    description: 'Fecha inicial del plan',
    type: String,
    format: 'date-time',
  })
  @Transform(({ value }) => new Date(value))
  @Expose()
  fechaInicio!: Date;

  @ApiProperty({
    description: 'Fecha final del plan, si aplica',
    type: String,
    format: 'date-time',
    nullable: true,
  })
  @Transform(({ value }) =>
    value === null || value === undefined ? null : new Date(value),
  )
  @Expose()
  fechaFin!: Date | null;

  @ApiProperty({
    description: 'Porcentaje de mora aplicado al plan',
    type: Number,
    nullable: true,
    example: 10,
  })
  @Expose()
  moraPorcentaje!: number | null;

  @ApiProperty({
    description: 'Valor fijo de mora aplicado al plan',
    type: Number,
    nullable: true,
    example: 30000,
  })
  @Expose()
  moraValor!: number | null;

  @ApiProperty({
    description: 'Estado actual de la suscripción',
    type: String,
    example: 'activo',
  })
  @Expose()
  estado!: string;

  @ApiProperty({
    description: 'Servicios asignados al cliente',
    type: () => [ServicioAsignadoResponseDto],
  })
  @Expose()
  @Type(() => ServicioAsignadoResponseDto)
  servicios!: ServicioAsignadoResponseDto[];
}

