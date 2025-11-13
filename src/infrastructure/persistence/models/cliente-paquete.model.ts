import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ClienteModel } from './cliente.model';
import { ClientePaqueteServicioModel } from './cliente-paquete-servicio.model';

@Table({
  tableName: 'cliente_paquetes',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
})
export class ClientePaqueteModel extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @AllowNull(false)
  @Column({ type: DataType.BIGINT, field: 'tenant_id' })
  tenantId!: number;

  @ForeignKey(() => ClienteModel)
  @AllowNull(false)
  @Column({ type: DataType.BIGINT, field: 'cliente_id' })
  clienteId!: number;

  @AllowNull(false)
  @Column({ type: DataType.BIGINT, field: 'paquete_original_id' })
  paqueteOriginalId!: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING(150), field: 'nombre_paquete' })
  nombrePaquete!: string;

  @AllowNull(true)
  @Column({ type: DataType.STRING(255), field: 'descripcion_paquete' })
  descripcionPaquete!: string | null;

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

  @AllowNull(true)
  @Column({ type: DataType.INTEGER, field: 'dia_cobro' })
  diaCobro!: number | null;

  @AllowNull(true)
  @Column({ type: DataType.INTEGER, field: 'dias_gracia' })
  diasGracia!: number | null;

  @AllowNull(false)
  @Column({ type: DataType.STRING(20), field: 'frecuencia_tipo' })
  frecuenciaTipo!: string;

  @AllowNull(true)
  @Column({ type: DataType.INTEGER, field: 'frecuencia_valor' })
  frecuenciaValor!: number | null;

  @AllowNull(false)
  @Column({ type: DataType.DATE, field: 'fecha_inicio' })
  fechaInicio!: Date;

  @AllowNull(true)
  @Column({ type: DataType.DATE, field: 'fecha_fin' })
  fechaFin!: Date | null;

  @AllowNull(true)
  @Column({
    type: DataType.DECIMAL(5, 2),
    field: 'mora_porcentaje',
    get(): number | null {
      const valor = this.getDataValue('moraPorcentaje');
      return valor === null || valor === undefined ? null : Number(valor);
    },
  })
  moraPorcentaje!: number | null;

  @AllowNull(true)
  @Column({
    type: DataType.DECIMAL(12, 2),
    field: 'mora_valor',
    get(): number | null {
      const valor = this.getDataValue('moraValor');
      return valor === null || valor === undefined ? null : Number(valor);
    },
  })
  moraValor!: number | null;

  @Default('activo')
  @AllowNull(false)
  @Column({ type: DataType.STRING(20) })
  estado!: string;

  @AllowNull(true)
  @Column({ type: DataType.BIGINT, field: 'creado_usuario_id' })
  creadoUsuarioId!: number | null;

  @BelongsTo(() => ClienteModel)
  cliente?: ClienteModel;

  @HasMany(() => ClientePaqueteServicioModel, 'cliente_paquete_id')
  servicios?: ClientePaqueteServicioModel[];
}
