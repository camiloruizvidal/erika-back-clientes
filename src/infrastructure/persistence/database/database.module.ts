import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Config } from '../../config/config';
import { ClienteModel } from '../models/cliente.model';
import { TipoDocumentoModel } from '../models/tipo-documento.model';
import { ClientePaqueteModel } from '../models/cliente-paquete.model';
import { ClientePaqueteServicioModel } from '../models/cliente-paquete-servicio.model';
import { PaqueteModel } from '../models/paquete.model';
import { PaqueteServicioModel } from '../models/paquete-servicio.model';
import { ServicioModel } from '../models/servicio.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: Config.dbDialect,
      host: Config.dbHost,
      port: Config.dbPuerto,
      username: Config.dbUsuario,
      password: Config.dbContrasena,
      database: Config.dbBaseDatos,
      models: [
        ClienteModel,
        TipoDocumentoModel,
        ClientePaqueteModel,
        ClientePaqueteServicioModel,
        PaqueteModel,
        PaqueteServicioModel,
        ServicioModel,
      ],
      logging: Config.dbLogging,
      define: {
        underscored: true,
      },
    }),
  ],
})
export class DatabaseModule {}
