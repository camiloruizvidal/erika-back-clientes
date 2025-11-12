import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { plainToInstance } from 'class-transformer';
import { CrearClienteDto } from '../dto/crear-cliente.dto';
import { ClienteCreadoDto } from '../dto/cliente-creado.dto';
import { ClientesService } from '../../application/services/clientes.service';
import { ManejadorError } from '../../utils/manejador-error/manejador-error';
import { ClientesMapper } from '../../shared/mappings/clientes.mapper';
import { JwtTenantGuard } from '../guards/jwt-tenant.guard';

interface RequestConTenant extends Request {
  tenantId?: number;
}

@ApiTags('customers')
@Controller('api/v1/customers')
export class ClientesController {
  constructor(
    private readonly clientesService: ClientesService,
    private readonly manejadorError: ManejadorError,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtTenantGuard)
  @ApiBody({ type: CrearClienteDto })
  @ApiCreatedResponse({ type: ClienteCreadoDto })
  public async crear(
    @Body() dto: CrearClienteDto,
    @Req() request: RequestConTenant,
  ): Promise<ClienteCreadoDto> {
    try {
      const tenantId = request.tenantId as number;
      const payload = ClientesMapper.toInterface(dto, tenantId);
      const cliente = await this.clientesService.crearCliente(payload);

      return plainToInstance(ClienteCreadoDto, cliente, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.manejadorError.resolverErrorApi(error);
    }
  }
}
