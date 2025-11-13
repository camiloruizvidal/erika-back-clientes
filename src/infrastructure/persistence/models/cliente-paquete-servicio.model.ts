import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ClientePaqueteModel } from './cliente-paquete.model';

@Table({
  tableName: 'cliente_paquete_servicios',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
})
export class ClientePaqueteServicioModel extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @AllowNull(false)
  @Column({ type: DataType.BIGINT, field: 'tenant_id' })
  tenantId!: number;

  @ForeignKey(() => ClientePaqueteModel)
  @AllowNull(false)
  @Column({ type: DataType.BIGINT, field: 'cliente_paquete_id' })
  clientePaqueteId!: number;

  @AllowNull(false)
  @Column({ type: DataType.BIGINT, field: 'servicio_original_id' })
  servicioOriginalId!: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING(150), field: 'nombre_servicio' })
  nombreServicio!: string;

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL(12, 2),
    field: 'valor_original',
    get(): number {
      const valor = this.getDataValue('valorOriginal');
      return valor === null || valor === undefined ? 0 : Number(valor);
    },
  })
  valorOriginal!: number;

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL(12, 2),
    field: 'valor_acordado',
    get(): number {
      const valor = this.getDataValue('valorAcordado');
      return valor === null || valor === undefined ? 0 : Number(valor);
    },
  })
  valorAcordado!: number;

  @BelongsTo(() => ClientePaqueteModel, 'cliente_paquete_id')
  clientePaquete?: ClientePaqueteModel;
}
