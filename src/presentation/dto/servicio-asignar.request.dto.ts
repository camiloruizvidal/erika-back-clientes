import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsInt, Min } from 'class-validator';
import { Constantes } from '../../utils/constantes';
import { TransformadoresDto } from '../utils/transformadores-dto.helper';

export class ServicioAsignarRequestDto {
  @ApiProperty({
    description: 'Identificador del servicio original perteneciente al paquete',
    type: Number,
    example: 12,
  })
  @Transform(({ value }) => TransformadoresDto.transformarNumero(value))
  @IsInt({ message: Constantes.PROPIEDAD_NO_PERMITIDA('id') })
  @Min(1, { message: Constantes.VALOR_MINIMO('id', 1) })
  @Expose({ name: 'id' })
  id!: number;
}

