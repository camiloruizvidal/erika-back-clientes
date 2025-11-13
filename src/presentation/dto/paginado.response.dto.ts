import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ClienteListadoResponseDto } from './cliente-listado.response.dto';

export class MetaPaginadoResponseDto {
  @ApiProperty({ description: 'Total de registros disponibles', type: Number })
  @Expose({ name: 'total' })
  total!: number;

  @ApiProperty({
    description: 'Número de página actual (1-based)',
    type: Number,
  })
  @Expose({ name: 'pagina' })
  pagina!: number;

  @ApiProperty({
    description: 'Cantidad de elementos por página',
    type: Number,
  })
  @Expose({ name: 'tamanoPagina' })
  tamano_pagina!: number;
}

export class PaginadoResponseDto<T> {
  @ApiProperty({ type: () => MetaPaginadoResponseDto })
  @Expose({ name: 'meta' })
  @Type(() => MetaPaginadoResponseDto)
  meta!: MetaPaginadoResponseDto;

  @ApiProperty({ isArray: true, type: () => Object })
  @Expose({ name: 'data' })
  data!: T[];
}

export class ClientesPaginadosResponseDto extends PaginadoResponseDto<ClienteListadoResponseDto> {
  @ApiProperty({ isArray: true, type: () => ClienteListadoResponseDto })
  @Expose({ name: 'data' })
  @Type(() => ClienteListadoResponseDto)
  declare data: ClienteListadoResponseDto[];
}
