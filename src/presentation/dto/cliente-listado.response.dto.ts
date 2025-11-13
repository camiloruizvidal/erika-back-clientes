import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class ClienteListadoResponseDto {
  @ApiProperty({ description: 'Identificador del cliente', type: Number })
  @Transform(({ value }) => Number(value))
  @Expose({ name: 'id' })
  id!: number;

  @ApiProperty({ description: 'Primer nombre', type: String })
  @Expose({ name: 'primerNombre' })
  primer_nombre!: string;

  @ApiProperty({ description: 'Segundo nombre', type: String, nullable: true })
  @Expose({ name: 'segundoNombre' })
  segundo_nombre!: string | null;

  @ApiProperty({ description: 'Primer apellido', type: String })
  @Expose({ name: 'primerApellido' })
  primer_apellido!: string;

  @ApiProperty({ description: 'Segundo apellido', type: String, nullable: true })
  @Expose({ name: 'segundoApellido' })
  segundo_apellido!: string | null;

  @ApiProperty({ description: 'Nombre completo', type: String })
  @Expose({ name: 'nombreCompleto' })
  nombre_completo!: string;

  @ApiProperty({ description: 'Correo electrónico', type: String })
  @Expose({ name: 'correo' })
  correo!: string;

  @ApiProperty({ description: 'Teléfono de contacto', type: String, nullable: true })
  @Expose({ name: 'telefono' })
  telefono!: string | null;

  @ApiProperty({ description: 'Documento de identificación', type: String, nullable: true })
  @Expose({ name: 'identificacion' })
  identificacion!: string | null;

  @ApiProperty({ description: 'Estado activo del cliente', type: Boolean })
  @Expose({ name: 'activo' })
  activo!: boolean;
}

