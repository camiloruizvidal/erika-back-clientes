import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { plainToInstance } from 'class-transformer';
import { CrearClienteRequestDto } from '../dto/crear-cliente.request.dto';
import { ClienteCreadoResponseDto } from '../dto/cliente-creado.response.dto';
import { ClientesService } from '../../application/services/clientes.service';
import { ManejadorError } from '../../utils/manejador-error/manejador-error';
import { ClientesMapper } from '../../shared/mappings/clientes.mapper';
import { JwtTenantGuard } from '../guards/jwt-tenant.guard';
import { CrearAsignacionPaqueteRequestDto } from '../dto/crear-asignacion-paquete.request.dto';
import { AsignacionPaqueteResponseDto } from '../dto/asignacion-paquete.response.dto';
import { AsignacionesMapper } from '../../shared/mappings/asignaciones.mapper';
import { AsignacionesService } from '../../application/services/asignaciones.service';

interface RequestConTenant extends Request {
  tenantId: number;
  usuarioId: number;
}

@ApiTags('customers')
@Controller('api/v1/customers')
export class ClientesController {
  constructor(
    private readonly clientesService: ClientesService,
    private readonly asignacionesService: AsignacionesService,
    private readonly manejadorError: ManejadorError,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtTenantGuard)
  @ApiBody({ type: CrearClienteRequestDto })
  @ApiCreatedResponse({ type: ClienteCreadoResponseDto })
  public async crear(
    @Body() dto: CrearClienteRequestDto,
    @Req() request: RequestConTenant,
  ): Promise<ClienteCreadoResponseDto> {
    try {
      const tenantId = Number(request.tenantId);
      const payload = ClientesMapper.toInterface(dto, tenantId);
      const cliente = await this.clientesService.crearCliente(payload);
      console.log({ cliente });
      return plainToInstance(ClienteCreadoResponseDto, cliente, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      Logger.error({ error: JSON.stringify(error) });
      this.manejadorError.resolverErrorApi(error);
    }
  }

  @Post(':clienteId/packages')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtTenantGuard)
  @ApiBody({ type: CrearAsignacionPaqueteRequestDto })
  @ApiCreatedResponse({ type: AsignacionPaqueteResponseDto })
  public async asignarPaquete(
    @Param('clienteId', ParseIntPipe) clienteId: number,
    @Body() dto: CrearAsignacionPaqueteRequestDto,
    @Req() request: RequestConTenant,
  ): Promise<AsignacionPaqueteResponseDto> {
    try {
      const tenantId = request.tenantId;
      const usuarioId = request.usuarioId;
      const payload = AsignacionesMapper.toInterface(dto, usuarioId);
      const asignacion = await this.asignacionesService.asignarPaqueteACliente(
        tenantId,
        clienteId,
        payload,
      );

      return plainToInstance(AsignacionPaqueteResponseDto, asignacion, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      Logger.error({ error: JSON.stringify(error) });
      this.manejadorError.resolverErrorApi(error);
    }
  }
}
