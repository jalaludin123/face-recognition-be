import { ObjectType } from '@nestjs/graphql';
import { SuccessResponse } from '../interfaces/success-response.interface';

@ObjectType({
  implements: [SuccessResponse],
})
export class Success extends SuccessResponse {
  constructor(partial?: Partial<Success>) {
    super(partial?.message || 'Success');
    Object.assign(this, partial);
  }
}
