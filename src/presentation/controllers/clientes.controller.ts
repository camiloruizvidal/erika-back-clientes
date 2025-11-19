import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
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
import { PaginadoClientesRequestDto } from '../dto/paginado-clientes.request.dto';
import { ClientesPaginadosResponseDto } from '../dto/paginado.response.dto';

interface RequestConTenant extends Request {
  tenantId: number;
  usuarioId: number;
}

@ApiTags('customers')
@Controller('api/v1/customers')
export class ClientesController {
  private readonly logger = new Logger(ClientesController.name);

  constructor(
    private readonly clientesService: ClientesService,
    private readonly asignacionesService: AsignacionesService,
    private readonly manejadorError: ManejadorError,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtTenantGuard)
  @ApiOkResponse({ type: ClientesPaginadosResponseDto })
  public async listar(
    @Query() query: PaginadoClientesRequestDto,
    @Req() request: RequestConTenant,
  ): Promise<ClientesPaginadosResponseDto> {
    try {
      const tenantId = request.tenantId;
      const pagina = query.pagina ?? 1;
      const tamanoPagina = query.tamanoPagina ?? 10;
      const filtro = query.filtro?.trim() || undefined;
      const resultado = await this.clientesService.listarClientes(
        tenantId,
        pagina,
        tamanoPagina,
        filtro,
      );

      return plainToInstance(ClientesPaginadosResponseDto, resultado, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.logger.error({ error: JSON.stringify(error) });
      this.manejadorError.resolverErrorApi(error);
    }
  }

  @Get(':clienteId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtTenantGuard)
  @ApiOkResponse({ type: ClienteCreadoResponseDto })
  public async obtenerDetalle(
    @Param('clienteId', ParseIntPipe) clienteId: number,
    @Req() request: RequestConTenant,
  ): Promise<ClienteCreadoResponseDto> {
    try {
      const tenantId = request.tenantId;
      const cliente = await this.clientesService.obtenerDetalleCliente(
        tenantId,
        clienteId,
      );

      return plainToInstance(ClienteCreadoResponseDto, cliente, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.logger.error({ error: JSON.stringify(error) });
      this.manejadorError.resolverErrorApi(error);
    }
  }

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
      this.logger.error({ error: JSON.stringify(error) });
      this.manejadorError.resolverErrorApi(error);
    }
  }

  @Get(':clienteId/packages')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtTenantGuard)
  @ApiOkResponse({ type: [AsignacionPaqueteResponseDto] })
  public async obtenerPaquetes(
    @Param('clienteId', ParseIntPipe) clienteId: number,
    @Req() request: RequestConTenant,
  ): Promise<AsignacionPaqueteResponseDto[]> {
    try {
      const tenantId = request.tenantId;
      const asignaciones =
        await this.asignacionesService.obtenerPaquetesPorCliente(
          tenantId,
          clienteId,
        );

      return asignaciones.map((asignacion) =>
        plainToInstance(AsignacionPaqueteResponseDto, asignacion, {
          excludeExtraneousValues: true,
        }),
      );
    } catch (error) {
      this.logger.error({ error: JSON.stringify(error) });
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
      this.logger.error({ error: JSON.stringify(error) });
      this.manejadorError.resolverErrorApi(error);
    }
  }
}
