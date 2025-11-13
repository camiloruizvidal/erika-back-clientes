import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { Constantes } from '../../utils/constantes';
import { ServicioAsignarRequestDto } from './servicio-asignar.request.dto';
import type { FrecuenciaTipo } from '../../domain/interfaces/asignaciones.interface';
import { TransformadoresDto } from '../utils/transformadores-dto.helper';
import { FRECUENCIAS_VALIDAS } from './constantes/crear-asignacion-paquete.constantes';

export class CrearAsignacionPaqueteRequestDto {
  @ApiProperty({
    description: 'Identificador del paquete original a asignar',
    type: Number,
    example: 5,
  })
  @Transform(({ value }) => TransformadoresDto.transformarNumero(value))
  @IsInt({ message: Constantes.PROPIEDAD_NO_PERMITIDA('paquete_id') })
  @Min(1, { message: Constantes.VALOR_MINIMO('paquete_id', 1) })
  @Expose({ name: 'paquete_id' })
  paqueteId!: number;

  @ApiPropertyOptional({
    description:
      'Valor acordado para el paquete. Si no se envía se usa el valor original.',
    type: Number,
    example: 200000,
  })
  @IsOptional()
  @Transform(({ value }) => TransformadoresDto.transformarNumero(value))
  @IsNumber({}, { message: Constantes.PROPIEDAD_NO_PERMITIDA('valor_paquete') })
  @Min(0, { message: Constantes.VALOR_MINIMO('valor_paquete', 0) })
  @Expose({ name: 'valor_paquete' })
  valorPaquete?: number;

  @ApiPropertyOptional({
    description:
      'Día del mes en el que se realiza el cobro. Obligatorio cuando la frecuencia es mensual.',
    type: Number,
    example: 15,
  })
  @IsOptional()
  @Transform(({ value }) => TransformadoresDto.transformarNumero(value))
  @IsInt({ message: Constantes.PROPIEDAD_NO_PERMITIDA('dia_cobro') })
  @Min(1, { message: Constantes.VALOR_MINIMO('dia_cobro', 1) })
  @Expose({ name: 'dia_cobro' })
  diaCobro?: number;

  @ApiPropertyOptional({
    description:
      'Cantidad de días de gracia antes de aplicar mora. Si no se envía se asumirá sin gracia.',
    type: Number,
    example: 4,
  })
  @IsOptional()
  @Transform(({ value }) => TransformadoresDto.transformarNumero(value))
  @IsInt({ message: Constantes.PROPIEDAD_NO_PERMITIDA('dias_gracia') })
  @Min(0, { message: Constantes.VALOR_MINIMO('dias_gracia', 0) })
  @Expose({ name: 'dias_gracia' })
  diasGracia?: number;

  @ApiProperty({
    description:
      'Tipo de frecuencia para el cobro: mensual, semanas o servicios.',
    example: 'mensual',
    enum: FRECUENCIAS_VALIDAS,
  })
  @IsString({ message: Constantes.PROPIEDAD_NO_PERMITIDA('frecuencia_tipo') })
  @IsIn(FRECUENCIAS_VALIDAS, {
    message: Constantes.FRECUENCIA_NO_VALIDA,
  })
  @Expose({ name: 'frecuencia_tipo' })
  frecuenciaTipo!: FrecuenciaTipo;

  @ApiPropertyOptional({
    description:
      'Valor de la frecuencia cuando aplica. Ej: cada 5 semanas o cada 5 servicios.',
    type: Number,
    example: 5,
  })
  @IsOptional()
  @Transform(({ value }) => TransformadoresDto.transformarNumero(value))
  @IsInt({ message: Constantes.PROPIEDAD_NO_PERMITIDA('frecuencia_valor') })
  @Min(1, { message: Constantes.VALOR_MINIMO('frecuencia_valor', 1) })
  @Expose({ name: 'frecuencia_valor' })
  frecuenciaValor?: number;

  @ApiPropertyOptional({
    description: 'Fecha de inicio de la suscripción.',
    type: String,
    format: 'date-time',
    example: '2025-01-01',
  })
  @IsOptional()
  @Transform(({ value }) => TransformadoresDto.transformarFecha(value))
  @IsDate({ message: Constantes.PROPIEDAD_NO_PERMITIDA('fecha_inicio') })
  @Expose({ name: 'fecha_inicio' })
  fechaInicio?: Date;

  @ApiPropertyOptional({
    description: 'Fecha de finalización de la suscripción.',
    type: String,
    format: 'date-time',
    example: null,
  })
  @IsOptional()
  @Transform(({ value }) => TransformadoresDto.transformarFecha(value))
  @IsDate({ message: Constantes.PROPIEDAD_NO_PERMITIDA('fecha_fin') })
  @Expose({ name: 'fecha_fin' })
  fechaFin?: Date;

  @ApiPropertyOptional({
    description:
      'Porcentaje de mora a aplicar una vez se supere la frecuencia pactada y los días de gracia.',
    type: Number,
    example: 10,
  })
  @IsOptional()
  @Transform(({ value }) => TransformadoresDto.transformarNumero(value))
  @IsNumber(
    {},
    { message: Constantes.PROPIEDAD_NO_PERMITIDA('mora_porcentaje') },
  )
  @Min(0, { message: Constantes.VALOR_MINIMO('mora_porcentaje', 0) })
  @Expose({ name: 'mora_porcentaje' })
  moraPorcentaje?: number;

  @ApiPropertyOptional({
    description:
      'Valor fijo de mora a aplicar una vez se supere la frecuencia pactada y los días de gracia.',
    type: Number,
    example: 30000,
  })
  @IsOptional()
  @Transform(({ value }) => TransformadoresDto.transformarNumero(value))
  @IsNumber({}, { message: Constantes.PROPIEDAD_NO_PERMITIDA('mora_valor') })
  @Min(0, { message: Constantes.VALOR_MINIMO('mora_valor', 0) })
  @Expose({ name: 'mora_valor' })
  moraValor?: number;

  @ApiPropertyOptional({
    description:
      'Listado de servicios a copiar con sus valores acordados. Si se omite se copiarán todos los servicios del paquete con sus valores originales.',
    type: () => [ServicioAsignarRequestDto],
  })
  @IsOptional()
  @IsArray({ message: Constantes.PROPIEDAD_NO_PERMITIDA('servicios') })
  @ArrayMinSize(0)
  @Type(() => ServicioAsignarRequestDto)
  @Expose({ name: 'servicios' })
  servicios?: ServicioAsignarRequestDto[];
}
