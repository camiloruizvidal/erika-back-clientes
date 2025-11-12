import { Module } from '@nestjs/common';
import { DatabaseModule } from './infrastructure/persistence/database/database.module';
import { ClientesModule } from './presentation/clientes.module';

@Module({
  imports: [DatabaseModule, ClientesModule],
})
export class AppModule {}
