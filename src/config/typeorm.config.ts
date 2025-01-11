import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { getMetadataArgsStorage } from 'typeorm';
import { isProd } from '../common/utils/boolean-hepers';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  isDebug = !isProd();

  createTypeOrmOptions(): TypeOrmModuleOptions {
    let slaves = [];
    const hostSlave1st = process.env.DB_HOST_SLAVE_1;
    const hostSlave2nd = process.env.DB_HOST_SLAVE_2;

    // add slaves 1st
    if (
      !(
        !hostSlave1st ||
        (typeof hostSlave1st == 'string' && hostSlave1st.length)
      )
    )
      slaves = [
        {
          host: process.env.hostSlave1st,
          port: Number(process.env.DB_PORT_SLAVE_1),
          username: process.env.DB_USER_SLAVE_1,
          password: process.env.DB_PASSWORD_SLAVE_1,
          database: process.env.DB_NAME_SLAVE_1,
        },
      ];

    // add slaves 2nd
    if (
      !(
        !hostSlave2nd ||
        (typeof hostSlave2nd == 'string' && hostSlave2nd.length)
      )
    )
      slaves = [
        ...slaves,
        {
          host: process.env.hostSlave2nd,
          port: Number(process.env.DB_PORT_SLAVE_2),
          username: process.env.DB_USER_SLAVE_2,
          password: process.env.DB_PASSWORD_SLAVE_2,
          database: process.env.DB_NAME_SLAVE_2,
        },
      ];

    return {
      type: 'postgres',

      replication: {
        master: {
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          username: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database:
            process.env.NODE_ENV === 'test'
              ? process.env.DB_NAME_TEST
              : process.env.DB_NAME,
        },
        slaves,
      },
      synchronize: true,
      logging: true, //this.isDebug
      entities: getMetadataArgsStorage().tables.map((t) => t.target),
      migrations: ['dist/migrations/*{.ts,.js}'],
      migrationsTableName: 'migrations_typeorm',
      migrationsRun: false,
    };
  }
}
