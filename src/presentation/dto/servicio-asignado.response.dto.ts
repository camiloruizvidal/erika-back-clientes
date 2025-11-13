import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class ServicioAsignadoResponseDto {
  @ApiProperty({
    description: 'Identificador del servicio asignado al cliente',
    type: Number,
    example: 10,
  })
  @Transform(({ value }) => Number(value))
  @Expose()
  id!: number;

  @ApiProperty({
    description: 'Identificador del servicio original',
    type: Number,
    example: 4,
  })
  @Transform(({ value }) => Number(value))
  @Expose({ name: 'servicioOriginalId' })
  servicio_original_id!: number;

  @ApiProperty({
    description: 'Nombre del servicio copiado',
    type: String,
    example: 'Clase individual de inglés',
  })
  @Expose({ name: 'nombreServicio' })
  nombre_servicio!: string;

  @ApiProperty({
    description: 'Valor original del servicio',
    type: Number,
    example: 40000,
  })
  @Transform(({ value }) => Number(value))
  @Expose({ name: 'valorOriginal' })
  valor_original!: number;

  @ApiProperty({
    description: 'Valor acordado para el cliente',
    type: Number,
    example: 38000,
  })
  @Transform(({ value }) => Number(value))
  @Expose({ name: 'valorAcordado' })
  valor_acordado!: number;
}

