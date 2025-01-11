import { createUnionType } from '@nestjs/graphql';
import { InvalidInputError } from '../../graphql/responses/invalid-input.error';
import { Error } from '../../graphql/types/error.type';
import { Success } from '../../graphql/types/success.type';
import { AuthUserResponse, RefreshTokenResponse } from './auth.response';

export const RefreshTokenResultUnion = createUnionType({
  name: 'RefreshTokenResult',
  types: () => [RefreshTokenResponse, Error],
});

export const LoginUserResultUnion = createUnionType({
  name: 'LoginUserResult',
  types: () => [AuthUserResponse, Error],
});

export const RegisterUserResultUnion = createUnionType({
  name: 'RegisterUserResult',
  types: () => [Success, InvalidInputError, Error],
});

export const GetRefreshTokenResultUnion = createUnionType({
  name: 'GetRefreshTokenResult',
  types: () => [AuthUserResponse, Error],
});
