import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationError, ValidationPipe } from '@nestjs/common';
import { InputValidationException } from './common/exceptions/input-validation.exception';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: false,
      forbidNonWhitelisted: false,
      skipMissingProperties: true,
      forbidUnknownValues: true,
      exceptionFactory(errors) {
        let parsedErrors: any = errors;

        // find message on nested
        while (
          parsedErrors.length &&
          (!parsedErrors[0].constraints ||
            (parsedErrors[0].field == 'update' && parsedErrors[0].children))
        )
          parsedErrors = parsedErrors[0].children;

        return new InputValidationException(
          parsedErrors.map((e: ValidationError) => {
            return {
              field: e.property || 'unknown',
              messages: Object.values(e.constraints),
            };
          }),
        );
      },
    }),
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const whitelist = [
    // LOCAL
    'http://localhost:8002',
    'http://127.0.0.1:8002',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://localhost:8001',
    'http://127.0.0.1:8001',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:4000',
    'http://127.0.0.1:4000'
  ];
  app.enableCors({
    origin: function (origin, callback) {
      let res = false;
      whitelist.forEach((e) => {
        if (origin && origin.indexOf(e) == 0) res = true;
      });

      if (!origin || res) {
        callback(null, true);
      } else {
        console.log(origin, 'not registered CORS');
        callback(new Error('Not allowed by CORS'));
      }
    },
  });

  await app.listen(configService.get('PORT', ''));
  if (process.env.DB_INIT === 'true') {
    console.log('kill process id', process.pid);
    app.close();
  }
}
bootstrap();
