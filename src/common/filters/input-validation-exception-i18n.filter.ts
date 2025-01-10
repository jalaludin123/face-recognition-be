import { ArgumentsHost, Catch } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { InputValidationException } from '../exceptions/input-validation.exception';
import { InvalidInputError } from '../../graphql/responses/invalid-input.error';
import { getI18nContextFromArgumentsHost } from 'nestjs-i18n';
import { Log } from '../utils/log';

@Catch(InputValidationException)
export class InputValidationExceptionI18nFilter implements GqlExceptionFilter {
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
    const resp = new InvalidInputError(errors);
    return [resp];
  }
}
