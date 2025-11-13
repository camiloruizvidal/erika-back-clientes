import { HttpStatus, Injectable } from '@nestjs/common';
import { IAsignacionesService } from '../ports/asignaciones.port';
import {
  IAsignarPaquete,
  IAsignacionCreada,
  IServicioAsignado,
  IServicioAsignar,
  FrecuenciaTipo,
  EFrecuenciaTipo,
} from '../../domain/interfaces/asignaciones.interface';
import { ClienteRepository } from '../../infrastructure/persistence/repositories/cliente.repository';
import { PaqueteRepository } from '../../infrastructure/persistence/repositories/paquete.repository';
import { PaqueteServicioRepository } from '../../infrastructure/persistence/repositories/paquete-servicio.repository';
import { ClientePaqueteRepository } from '../../infrastructure/persistence/repositories/cliente-paquete.repository';
import { ClientePaqueteServicioRepository } from '../../infrastructure/persistence/repositories/cliente-paquete-servicio.repository';
import { IClientePaqueteServicio } from '../../infrastructure/persistence/interfaces/cliente-paquete-servicio.interface';
import { IClientePaquete } from '../../infrastructure/persistence/interfaces/cliente-paquete.interface';
import { ErrorPersonalizado } from '../../utils/error-personalizado/error-personalizado';
import { Constantes } from '../../utils/constantes';

type DetalleServicioSolicitado = {
  servicioOriginalId: number;
  nombreServicio: string;
  valorOriginal: number;
};

interface IContextoAsignacion {
  paqueteId: number;
  paqueteNombre: string;
  paqueteValor: number;
  valorPaquete: number;
  fechaInicio: Date;
  fechaFin: Date | null;
  frecuenciaTipo: EFrecuenciaTipo;
  serviciosSolicitadosIds: number[];
  detallesServicios: DetalleServicioSolicitado[];
}

@Injectable()
export class AsignacionesService implements IAsignacionesService {
  public async asignarPaqueteACliente(
    tenantId: number,
    clienteId: number,
    payload: IAsignarPaquete,
  ): Promise<IAsignacionCreada> {
    const {
      paqueteId,
      paqueteNombre,
      paqueteValor,
      valorPaquete,
      fechaInicio,
      fechaFin,
      frecuenciaTipo,
      serviciosSolicitadosIds,
      detallesServicios,
    } = await this.validarServiciosYPaquete(tenantId, clienteId, payload);

    const datosPersistencia = {
      tenantId,
      clienteId,
      paqueteOriginalId: paqueteId,
      nombrePaquete: paqueteNombre,
      descripcionPaquete: null,
      valorOriginal: paqueteValor,
      valorAcordado: valorPaquete,
      diaCobro:
        frecuenciaTipo === EFrecuenciaTipo.MENSUAL
          ? (payload.diaCobro ?? null)
          : null,
      diasGracia: payload.diasGracia ?? null,
      frecuenciaTipo,
      frecuenciaValor:
        frecuenciaTipo === EFrecuenciaTipo.MENSUAL
          ? null
          : (payload.frecuenciaValor ?? null),
      fechaInicio,
      fechaFin,
      moraPorcentaje: payload.moraPorcentaje ?? null,
      moraValor: payload.moraValor ?? null,
      estado: 'activo',
      creadoUsuarioId: payload.creadoUsuarioId,
    };

    const clientePaquete =
      await ClientePaqueteRepository.crearClientePaquete(datosPersistencia);

    const serviciosActuales: IClientePaqueteServicio[] =
      await ClientePaqueteServicioRepository.obtenerServiciosPorClientePaquete(
        clientePaquete.id,
      );

    const idsActuales = new Set(
      serviciosActuales.map((servicio) => servicio.servicioOriginalId),
    );
    const idsSolicitados = new Set(serviciosSolicitadosIds);

    const serviciosPorEliminar = serviciosActuales
      .filter((servicio) => !idsSolicitados.has(servicio.servicioOriginalId))
      .map((servicio) => servicio.servicioOriginalId);

    if (serviciosPorEliminar.length > 0) {
      await (
        ClientePaqueteServicioRepository.eliminarServiciosAsignados as (
          clientePaqueteServicioId: number,
          serviciosOriginalesIds: number[],
        ) => Promise<void>
      )(clientePaquete.id, serviciosPorEliminar);
    }

    const serviciosPorAgregar = detallesServicios.filter(
      (detalle) => !idsActuales.has(detalle.servicioOriginalId),
    );

    if (serviciosPorAgregar.length > 0) {
      await ClientePaqueteServicioRepository.crearServiciosAsignados(
        serviciosPorAgregar.map((detalle) => ({
          tenantId,
          clientePaqueteId: clientePaquete.id,
          servicioOriginalId: detalle.servicioOriginalId,
          nombreServicio: detalle.nombreServicio,
          valorOriginal: detalle.valorOriginal,
          valorAcordado: detalle.valorOriginal,
        })),
      );
    }

    const serviciosAsignadosRegistros =
      await ClientePaqueteServicioRepository.obtenerServiciosPorClientePaquete(
        clientePaquete.id,
      );

    const serviciosAsignados: IServicioAsignado[] =
      serviciosAsignadosRegistros.map((registro) => ({
        id: registro.id,
        servicioOriginalId: registro.servicioOriginalId,
        nombreServicio: registro.nombreServicio,
        valorOriginal: registro.valorOriginal,
        valorAcordado: registro.valorAcordado,
      }));

    return {
      id: clientePaquete.id,
      clienteId,
      paqueteOriginalId: paqueteId,
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
  }

  private validarFrecuencia(payload: IAsignarPaquete): void {
    const frecuenciaTipo = payload.frecuenciaTipo as EFrecuenciaTipo;

    if (frecuenciaTipo === EFrecuenciaTipo.MENSUAL && !payload.diaCobro) {
      throw new ErrorPersonalizado(
        HttpStatus.BAD_REQUEST,
        Constantes.DIA_COBRO_OBLIGATORIO,
      );
    }

    if (
      (frecuenciaTipo === EFrecuenciaTipo.SEMANAS ||
        frecuenciaTipo === EFrecuenciaTipo.SERVICIOS) &&
      (!payload.frecuenciaValor || payload.frecuenciaValor <= 0)
    ) {
      throw new ErrorPersonalizado(
        HttpStatus.BAD_REQUEST,
        Constantes.FRECUENCIA_VALOR_OBLIGATORIA,
      );
    }
  }

  private async validarServiciosYPaquete(
    tenantId: number,
    clienteId: number,
    payload: IAsignarPaquete,
  ): Promise<IContextoAsignacion> {
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

    const frecuenciaTipo = payload.frecuenciaTipo as EFrecuenciaTipo;
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

    let serviciosSolicitadosEntrada: IServicioAsignar[];
    if (payload.servicios && payload.servicios.length > 0) {
      serviciosSolicitadosEntrada = payload.servicios;
    } else if (payload.servicios === undefined || payload.servicios === null) {
      serviciosSolicitadosEntrada = Array.from(serviciosDisponibles.keys()).map(
        (servicioId) => ({
          servicioId,
        }),
      );
    } else {
      serviciosSolicitadosEntrada = [];
    }

    const idsSeleccionados = new Set<number>();
    const detallesServicios: DetalleServicioSolicitado[] = [];
    const serviciosSolicitadosIds: number[] = [];

    for (const servicio of serviciosSolicitadosEntrada) {
      const servicioId = Number(servicio.servicioId);

      if (Number.isNaN(servicioId) || servicioId <= 0) {
        throw new ErrorPersonalizado(
          HttpStatus.BAD_REQUEST,
          Constantes.SERVICIO_NO_PERTENECE_PAQUETE,
        );
      }

      if (idsSeleccionados.has(servicioId)) {
        throw new ErrorPersonalizado(
          HttpStatus.BAD_REQUEST,
          Constantes.SERVICIO_DUPLICADO_EN_ASIGNACION,
        );
      }

      const servicioDisponible = serviciosDisponibles.get(servicioId);

      if (!servicioDisponible || servicioDisponible.tenantId !== tenantId) {
        throw new ErrorPersonalizado(
          HttpStatus.BAD_REQUEST,
          Constantes.SERVICIO_NO_PERTENECE_PAQUETE,
        );
      }

      idsSeleccionados.add(servicioId);
      detallesServicios.push({
        servicioOriginalId: servicioId,
        nombreServicio: servicioDisponible.nombre,
        valorOriginal: servicioDisponible.valor,
      });
      serviciosSolicitadosIds.push(servicioId);
    }

    if (detallesServicios.length === 0) {
      throw new ErrorPersonalizado(
        HttpStatus.BAD_REQUEST,
        Constantes.SERVICIOS_REQUERIDOS_PARA_PAQUETE,
      );
    }

    const clientePaqueteExistente =
      await ClientePaqueteRepository.buscarPorClienteYPaquete(
        clienteId,
        paquete.id,
      );

    if (clientePaqueteExistente) {
      throw new ErrorPersonalizado(
        HttpStatus.NOT_FOUND,
        Constantes.ASIGNACION_NO_ENCONTRADA,
      );
    }

    return {
      paqueteId: paquete.id,
      paqueteNombre: paquete.nombre,
      paqueteValor: paquete.valor,
      valorPaquete,
      fechaInicio,
      fechaFin,
      frecuenciaTipo,
      serviciosSolicitadosIds,
      detallesServicios,
    };
  }

  private async obtenerServiciosDisponibles(paqueteId: number): Promise<
    Map<
      number,
      {
        nombre: string;
        valor: number;
        tenantId: number;
      }
    >
  > {
    const relaciones =
      await PaqueteServicioRepository.obtenerServiciosPorPaquete(paqueteId);

    const mapa = new Map<
      number,
      { nombre: string; valor: number; tenantId: number }
    >();

    relaciones.forEach((relacion) => {
      if (relacion?.servicio) {
        mapa.set(Number(relacion.servicio.id), {
          nombre: relacion.servicio.nombre,
          valor: Number(relacion.servicio.valor),
          tenantId: Number(relacion.servicio.tenantId),
        });
      }
    });

    return mapa;
  }
}
