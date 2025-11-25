import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig = (): TypeOrmModuleOptions => ({
  type: 'sqljs',
  location: process.env.DB_PATH || './data/auction_system.db',
  autoSave: true,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true, // Forçar sincronização
  logging: true, // Habilitado temporariamente para debug
});
