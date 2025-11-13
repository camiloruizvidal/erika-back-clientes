import { CrearAsignacionPaqueteRequestDto } from '../../presentation/dto/crear-asignacion-paquete.request.dto';
import {
  IAsignarPaquete,
  IServicioAsignar,
} from '../../domain/interfaces/asignaciones.interface';

export class AsignacionesMapper {
  static toInterface(
    dto: CrearAsignacionPaqueteRequestDto,
    creadoUsuarioId: number,
  ): IAsignarPaquete {
    const servicios: IServicioAsignar[] =
      dto.servicios?.map((servicio) => ({
        servicioId: servicio.id,
      })) ?? [];

    return {
      paqueteId: dto.paqueteId,
      valorPaquete: dto.valorPaquete ?? null,
      diaCobro: dto.diaCobro ?? null,
      diasGracia: dto.diasGracia ?? null,
      frecuenciaTipo: dto.frecuenciaTipo,
      frecuenciaValor: dto.frecuenciaValor ?? null,
      fechaInicio: dto.fechaInicio ?? null,
      fechaFin: dto.fechaFin ?? null,
      moraPorcentaje: dto.moraPorcentaje ?? null,
      moraValor: dto.moraValor ?? null,
      creadoUsuarioId,
      servicios,
    };
  }
}
