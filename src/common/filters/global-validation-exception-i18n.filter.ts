import { ArgumentsHost, Catch } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { getI18nContextFromArgumentsHost } from 'nestjs-i18n';
import { Log } from '../utils/log';
import { UserInputError } from 'apollo-server-express';
import { InputValidationException } from '../exceptions/input-validation.exception';

@Catch(InputValidationException)
export class GlobalValidationExceptionI18nFilter implements GqlExceptionFilter {
  catch(exception: InputValidationException, host: ArgumentsHost) {
    const i18n = getI18nContextFromArgumentsHost(host);
    Log({
      message: `i18n lang = ${i18n.lang}`,
      info: true,
      exceptProduction: true,
    });
    const { errors } = exception;
    errors.map((error, i) => {
      Log({
        message: ['VALIDATION ' + (i + 1), error],
        exceptProduction: true,
      });

      error.messages = error.messages.map((e) => {
        const str = e.split('|');
        if (str.length === 1) return e;

        const key = str[0];
        const obj = JSON.parse(str[1]);

        return i18n.t(key, {
          args: [{ property: error.field, ...obj }],
        });
      });
      return error;
    });
    throw new UserInputError('Invalid Input', { errors });
  }
}
