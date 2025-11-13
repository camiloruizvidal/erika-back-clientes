import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { IAsignacionesService } from '../ports/asignaciones.port';
import {
  IAsignarPaquete,
  IAsignacionCreada,
  IServicioAsignado,
  FrecuenciaTipo,
  EFrecuenciaTipo,
} from '../../domain/interfaces/asignaciones.interface';
import { ClienteRepository } from '../../infrastructure/persistence/repositories/cliente.repository';
import { PaqueteRepository } from '../../infrastructure/persistence/repositories/paquete.repository';
import { PaqueteServicioRepository } from '../../infrastructure/persistence/repositories/paquete-servicio.repository';
import { ClientePaqueteRepository } from '../../infrastructure/persistence/repositories/cliente-paquete.repository';
import { ClientePaqueteServicioRepository } from '../../infrastructure/persistence/repositories/cliente-paquete-servicio.repository';
import { ErrorPersonalizado } from '../../utils/error-personalizado/error-personalizado';
import { Constantes } from '../../utils/constantes';

type ServiciosDisponibles = Map<
  number,
  {
    nombre: string;
    valor: number;
    tenantId: number;
  }
>;

@Injectable()
export class AsignacionesService implements IAsignacionesService {
  constructor(@InjectConnection() private readonly sequelize: Sequelize) {}

  public async asignarPaqueteACliente(
    tenantId: number,
    clienteId: number,
    payload: IAsignarPaquete,
  ): Promise<IAsignacionCreada> {
    this.validarFrecuencia(payload);

    const cliente = await ClienteRepository.buscarPorId(tenantId, clienteId);
    if (!cliente) {
      throw new ErrorPersonalizado(
        HttpStatus.NOT_FOUND,
        Constantes.CLIENTE_NO_ENCONTRADO,
      );
    }

    const paquete = await PaqueteRepository.buscarPorId(
      payload.paqueteId,
      tenantId,
    );

    if (!paquete) {
      throw new ErrorPersonalizado(
        HttpStatus.NOT_FOUND,
        Constantes.PAQUETE_NO_ENCONTRADO,
      );
    }

    const valorPaquete =
      payload.valorPaquete !== null && payload.valorPaquete !== undefined
        ? payload.valorPaquete
        : paquete.valor;

    const fechaInicio =
      payload.fechaInicio !== null && payload.fechaInicio !== undefined
        ? payload.fechaInicio
        : new Date();

    const fechaFin =
      payload.fechaFin !== null && payload.fechaFin !== undefined
        ? payload.fechaFin
        : null;

    const serviciosDisponibles = await this.obtenerServiciosDisponibles(
      paquete.id,
    );

    if (serviciosDisponibles.size === 0) {
      throw new ErrorPersonalizado(
        HttpStatus.BAD_REQUEST,
        Constantes.SERVICIOS_REQUERIDOS_PARA_PAQUETE,
      );
    }

    const serviciosSolicitados =
      payload.servicios && payload.servicios.length > 0
        ? payload.servicios
        : Array.from(serviciosDisponibles.keys()).map((servicioId) => ({
            servicioId,
          }));

    const idsSeleccionados = new Set<number>();
    for (const servicio of serviciosSolicitados) {
      if (idsSeleccionados.has(servicio.servicioId)) {
        throw new ErrorPersonalizado(
          HttpStatus.BAD_REQUEST,
          Constantes.SERVICIO_DUPLICADO_EN_ASIGNACION,
        );
      }
      idsSeleccionados.add(servicio.servicioId);
    }

    const asignacionExistente =
      await ClientePaqueteRepository.buscarPorClienteYPaquete(
        clienteId,
        paquete.id,
      );

    if (asignacionExistente) {
      throw new ErrorPersonalizado(
        HttpStatus.CONFLICT,
        Constantes.ASIGNACION_YA_EXISTE,
      );
    }

    return this.sequelize.transaction(async (transaction) => {
      const serviciosPreparados: Array<{
        tenantId: number;
        clientePaqueteId: number;
        servicioOriginalId: number;
        nombreServicio: string;
        valorOriginal: number;
        valorAcordado: number;
      }> = [];

      const serviciosAsignados: IServicioAsignado[] = [];

      const clientePaquete = await ClientePaqueteRepository.crearClientePaquete(
        {
          tenantId,
          clienteId,
          paqueteOriginalId: paquete.id,
          nombrePaquete: paquete.nombre,
          descripcionPaquete: null,
          valorOriginal: paquete.valor,
          valorAcordado: valorPaquete,
          diaCobro:
            payload.frecuenciaTipo === EFrecuenciaTipo.MENSUAL
              ? (payload.diaCobro ?? null)
              : null,
          diasGracia: payload.diasGracia ?? null,
          frecuenciaTipo: payload.frecuenciaTipo,
          frecuenciaValor:
            payload.frecuenciaTipo === EFrecuenciaTipo.MENSUAL
              ? null
              : (payload.frecuenciaValor ?? null),
          fechaInicio,
          fechaFin,
          moraPorcentaje: payload.moraPorcentaje ?? null,
          moraValor: payload.moraValor ?? null,
          estado: 'activo',
          creadoUsuarioId: payload.creadoUsuarioId,
        },
        transaction,
      );

      for (const servicioSolicitado of serviciosSolicitados) {
        const servicio = serviciosDisponibles.get(
          servicioSolicitado.servicioId,
        );
        if (!servicio || servicio.tenantId !== tenantId) {
          throw new ErrorPersonalizado(
            HttpStatus.BAD_REQUEST,
            Constantes.SERVICIO_NO_PERTENECE_PAQUETE,
          );
        }

        const valorOriginal = servicio.valor;
        const valorAcordado = valorOriginal;

        serviciosPreparados.push({
          tenantId,
          clientePaqueteId: clientePaquete.id,
          servicioOriginalId: servicioSolicitado.servicioId,
          nombreServicio: servicio.nombre,
          valorOriginal,
          valorAcordado,
        });

        serviciosAsignados.push({
          id: 0,
          servicioOriginalId: servicioSolicitado.servicioId,
          nombreServicio: servicio.nombre,
          valorOriginal,
          valorAcordado,
        });
      }

      const registrosServicios =
        await ClientePaqueteServicioRepository.crearServiciosAsignados(
          serviciosPreparados,
          transaction,
        );

      registrosServicios.forEach((registro, index) => {
        serviciosAsignados[index].id = registro.id;
      });

      return {
        id: clientePaquete.id,
        clienteId,
        paqueteOriginalId: paquete.id,
        nombrePaquete: clientePaquete.nombrePaquete,
        valorOriginal: clientePaquete.valorOriginal,
        valorAcordado: clientePaquete.valorAcordado,
        diaCobro: clientePaquete.diaCobro ?? null,
        diasGracia: clientePaquete.diasGracia ?? null,
        frecuenciaTipo: clientePaquete.frecuenciaTipo as FrecuenciaTipo,
        frecuenciaValor: clientePaquete.frecuenciaValor ?? null,
        fechaInicio: clientePaquete.fechaInicio,
        fechaFin: clientePaquete.fechaFin ?? null,
        moraPorcentaje: clientePaquete.moraPorcentaje ?? null,
        moraValor: clientePaquete.moraValor ?? null,
        estado: clientePaquete.estado,
        servicios: serviciosAsignados,
      };
    });
  }

  private validarFrecuencia(payload: IAsignarPaquete): void {
    if (
      payload.frecuenciaTipo === EFrecuenciaTipo.MENSUAL &&
      !payload.diaCobro
    ) {
      throw new ErrorPersonalizado(
        HttpStatus.BAD_REQUEST,
        Constantes.DIA_COBRO_OBLIGATORIO,
      );
    }

    if (
      (payload.frecuenciaTipo === EFrecuenciaTipo.SEMANAS ||
        payload.frecuenciaTipo === EFrecuenciaTipo.SERVICIOS) &&
      (!payload.frecuenciaValor || payload.frecuenciaValor <= 0)
    ) {
      throw new ErrorPersonalizado(
        HttpStatus.BAD_REQUEST,
        Constantes.FRECUENCIA_VALOR_OBLIGATORIA,
      );
    }
  }

  private async obtenerServiciosDisponibles(
    paqueteId: number,
  ): Promise<ServiciosDisponibles> {
    const servicios =
      await PaqueteServicioRepository.obtenerServiciosPorPaquete(paqueteId);

    const mapa: ServiciosDisponibles = new Map();
    servicios.forEach(({ servicio }) => {
      if (servicio) {
        mapa.set(servicio.id, {
          nombre: servicio.nombre,
          valor: servicio.valor,
          tenantId: servicio.tenantId,
        });
      }
    });

    return mapa;
  }
}
