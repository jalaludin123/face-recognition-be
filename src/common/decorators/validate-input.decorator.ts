import { applyDecorators, UseFilters, UsePipes } from '@nestjs/common';
import { InputValidationPipe } from '../pipes/input-validation.pipe';
import { InputValidationExceptionI18nFilter } from '../filters/input-validation-exception-i18n.filter';

export function ValidateInput() {
  return applyDecorators(
    UsePipes(InputValidationPipe),
    UseFilters(InputValidationExceptionI18nFilter),
  );
}
