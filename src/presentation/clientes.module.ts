import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientesController } from './controllers/clientes.controller';
import { ClientesService } from '../application/services/clientes.service';
import { ManejadorError } from '../utils/manejador-error/manejador-error';
import { JwtTenantGuard } from './guards/jwt-tenant.guard';
import { Config } from '../infrastructure/config/config';

@Module({
  imports: [
    JwtModule.register({
      secret: Config.jwtKey,
      signOptions: { expiresIn: '12h' },
    }),
  ],
  controllers: [ClientesController],
  providers: [ClientesService, ManejadorError, JwtTenantGuard],
})
export class ClientesModule {}
