import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { PaqueteModel } from './paquete.model';
import { ServicioModel } from './servicio.model';

@Table({
  tableName: 'paquete_servicios',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
})
export class PaqueteServicioModel extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @ForeignKey(() => PaqueteModel)
  @AllowNull(false)
  @Column({ type: DataType.BIGINT, field: 'paquete_id' })
  declare paqueteId: number;

  @ForeignKey(() => ServicioModel)
  @AllowNull(false)
  @Column({ type: DataType.BIGINT, field: 'servicio_id' })
  declare servicioId: number;

  @BelongsTo(() => PaqueteModel)
  paquete?: PaqueteModel;

  @BelongsTo(() => ServicioModel)
  servicio?: ServicioModel;
}
