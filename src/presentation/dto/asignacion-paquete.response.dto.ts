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
  @Expose({ name: 'clienteId' })
  cliente_id!: number;

  @ApiProperty({
    description: 'Identificador del paquete original',
    type: Number,
    example: 5,
  })
  @Transform(({ value }) => Number(value))
  @Expose({ name: 'paqueteOriginalId' })
  paquete_original_id!: number;

  @ApiProperty({
    description: 'Nombre del paquete copiado',
    type: String,
    example: 'Clases de inglés intensivas',
  })
  @Expose({ name: 'nombrePaquete' })
  nombre_paquete!: string;

  @ApiProperty({
    description: 'Valor original del paquete',
    type: Number,
    example: 220000,
  })
  @Transform(({ value }) => Number(value))
  @Expose({ name: 'valorOriginal' })
  valor_original!: number;

  @ApiProperty({
    description: 'Valor acordado para el cliente',
    type: Number,
    example: 200000,
  })
  @Transform(({ value }) => Number(value))
  @Expose({ name: 'valorAcordado' })
  valor_acordado!: number;

  @ApiProperty({
    description: 'Día del cobro (solo para frecuencia mensual)',
    type: Number,
    nullable: true,
    example: 15,
  })
  @Expose({ name: 'diaCobro' })
  dia_cobro!: number | null;

  @ApiProperty({
    description: 'Días de gracia antes de aplicar mora',
    type: Number,
    nullable: true,
    example: 4,
  })
  @Expose({ name: 'diasGracia' })
  dias_gracia!: number | null;

  @ApiProperty({
    description: 'Tipo de frecuencia: mensual, semanas o servicios',
    type: String,
    example: 'mensual',
  })
  @Expose({ name: 'frecuenciaTipo' })
  frecuencia_tipo!: string;

  @ApiProperty({
    description:
      'Valor de la frecuencia (semanas o servicios). Nulo para frecuencia mensual.',
    type: Number,
    nullable: true,
    example: 5,
  })
  @Expose({ name: 'frecuenciaValor' })
  frecuencia_valor!: number | null;

  @ApiProperty({
    description: 'Fecha inicial del plan',
    type: String,
    format: 'date-time',
  })
  @Transform(({ value }) => new Date(value))
  @Expose({ name: 'fechaInicio' })
  fecha_inicio!: Date;

  @ApiProperty({
    description: 'Fecha final del plan, si aplica',
    type: String,
    format: 'date-time',
    nullable: true,
  })
  @Transform(({ value }) =>
    value === null || value === undefined ? null : new Date(value),
  )
  @Expose({ name: 'fechaFin' })
  fecha_fin!: Date | null;

  @ApiProperty({
    description: 'Porcentaje de mora aplicado al plan',
    type: Number,
    nullable: true,
    example: 10,
  })
  @Expose({ name: 'moraPorcentaje' })
  mora_porcentaje!: number | null;

  @ApiProperty({
    description: 'Valor fijo de mora aplicado al plan',
    type: Number,
    nullable: true,
    example: 30000,
  })
  @Expose({ name: 'moraValor' })
  mora_valor!: number | null;

  @ApiProperty({
    description: 'Estado actual de la suscripción',
    type: String,
    example: 'activo',
  })
  @Expose({ name: 'estado' })
  estado!: string;

  @ApiProperty({
    description: 'Servicios asignados al cliente',
    type: () => [ServicioAsignadoResponseDto],
  })
  @Expose({ name: 'servicios' })
  @Type(() => ServicioAsignadoResponseDto)
  servicios!: ServicioAsignadoResponseDto[];
}

