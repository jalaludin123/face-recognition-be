import { JwtPayload } from '@/src/modules/auth/auth.types';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as jwt from 'jsonwebtoken';

export const GqlUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    let user: any = GqlExecutionContext.create(ctx).getContext().req?.user;

    if (!user) {
      const token =
        GqlExecutionContext.create(ctx).getContext().req?.headers
          ?.authorization;

      const userToken = jwt.verify(
        (token ?? '').replace('Bearer', 'bearer').split('bearer ').at(-1),
        process.env.JWT_SECRET
      ) as JwtPayload;

      const { sub = null } = userToken ?? {};

      user = {
        id: sub,
      };
    }

    return data ? user && user[data] : user;
  }
);
