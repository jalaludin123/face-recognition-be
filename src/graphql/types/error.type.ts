import { ObjectType } from '@nestjs/graphql';
import { ErrorResponse } from '../interfaces/error-response.interface';

@ObjectType({
  implements: [ErrorResponse],
})
export class Error extends ErrorResponse {
  constructor(partial?: Partial<Error>) {
    super(partial?.message || (typeof partial == 'string' ? partial : 'Error'));
    Object.assign(this, partial);
  }
}
