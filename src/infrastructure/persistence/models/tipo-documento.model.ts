import {
  Table,
  Column,
  DataType,
  Model,
  AllowNull,
  Default,
  HasMany,
} from 'sequelize-typescript';
import { ClienteModel } from './cliente.model';

@Table({
  tableName: 'tipos_documento',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
})
export class TipoDocumentoModel extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING(10) })
  declare codigo: string;

  @AllowNull(false)
  @Column({ field: 'nombre_corto', type: DataType.STRING(50) })
  declare nombreCorto: string;

  @AllowNull(false)
  @Column({ field: 'nombre_largo', type: DataType.STRING(150) })
  declare nombreLargo: string;

  @AllowNull(true)
  @Column({ type: DataType.TEXT })
  declare descripcion: string | null;

  @Default(true)
  @AllowNull(false)
  @Column({ type: DataType.BOOLEAN })
  declare activo: boolean;

  @HasMany(() => ClienteModel)
  clientes?: ClienteModel[];
}
