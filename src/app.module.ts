import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { envSchema } from './config/env.schema';
import jwtConfig from './config/jwt.config';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
import { QueryResolver } from './common/resolver/query.resolver';
import { GqlModuleOptions, GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/typeorm.config';
import { Log } from './common/utils/log';
import { APP_FILTER } from '@nestjs/core';
import { GlobalValidationExceptionI18nFilter } from './common/filters/global-validation-exception-i18n.filter';
import { graphqlUploadExpress } from 'graphql-upload';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveStaticOptions: {
        fallthrough: true
      }
    }),
    ConfigModule.forRoot({
      ignoreEnvFile: !!process.env.CI,
      envFilePath: join(__dirname, '..', '.env'),
      validationSchema: envSchema,
      isGlobal: true,
      load: [jwtConfig]
    }),
    I18nModule.forRoot({
      fallbackLanguage: process.env.LANG_I18N || 'en',
      fallbacks: {
        'id-ID': 'id',
      },
      loaderOptions: {
        path: join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang', 'locale', 'l'] },
        { use: AcceptLanguageResolver, options: { matchType: 'loose' } },
      ],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],

      useFactory: async (config: ConfigService) => {
        return {
          introspection: true,
          playground: true,
          autoSchemaFile: join(process.cwd(), 'schema.graphql'),
          context: ({ req, res }) => ({ req, res }),
          sortSchema: true,
          debug: !['production', 'test'].includes(
            config.get<string>('NODE_ENV'),
          ) as boolean,
          uploads: false,
          buildSchemaOptions: {
            numberScalarMode: 'integer',
          },
          formatError: (error) => {
            Log({ message: error, exceptTest: false, error: true });
            let graphQLFormattedError: any = {
              message:
                error.extensions?.exception?.response?.message || error.message,
              code: error.extensions?.code || 'SERVER_ERROR',
              name: error.extensions?.exception?.name || error.name,
            };
            if (error?.extensions?.errors)
              graphQLFormattedError = {
                ...graphQLFormattedError,
                errors: error.extensions.errors,
              };

            return graphQLFormattedError;
          },
        } as GqlModuleOptions;
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalValidationExceptionI18nFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        graphqlUploadExpress({
          maxFileSize: 10 * 1024 * 1024,
          maxFiles: 10,
        }),
      )
      .forRoutes('graphql');
  }
}
