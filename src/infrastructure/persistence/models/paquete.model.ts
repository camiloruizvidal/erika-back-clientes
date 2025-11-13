import {
  AllowNull,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { PaqueteServicioModel } from './paquete-servicio.model';

@Table({
  tableName: 'paquetes',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
})
export class PaqueteModel extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @AllowNull(false)
  @Column({ type: DataType.BIGINT, field: 'tenant_id' })
  tenantId!: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING(150) })
  nombre!: string;

  @AllowNull(true)
  @Column({ type: DataType.STRING(255) })
  descripcion!: string | null;

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL(12, 2),
    get(): number {
      const valor = this.getDataValue('valor');
      return valor === null || valor === undefined ? 0 : Number(valor);
    },
  })
  valor!: number;

  @HasMany(() => PaqueteServicioModel, 'paquete_id')
  servicios?: PaqueteServicioModel[];
}
