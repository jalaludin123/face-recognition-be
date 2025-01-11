import { InjectQueryService, QueryService } from '@nestjs-query/core';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../master/user/user.entity';
import { I18nService } from 'nestjs-i18n';
import { InputRefreshToken, RegisterInput } from './auth.input';
import { Success } from '@/src/graphql/types/success.type';
import { Error } from '@/src/graphql/types/error.type';
import { Either, either } from '@/src/common/utils/either';
import { AuthUserResponse } from './auth.response';
import { jwtDecode } from 'jwt-decode';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectQueryService(UserEntity)
    private userQueryService: QueryService<UserEntity>,
    private readonly i18n: I18nService
  ) {}

  async registerUser(user: RegisterInput): Promise<Either<Error, Success>> {
    const existedUser = (
      await this.userQueryService.query({
        filter: { email: { eq: user.email } },
      })
    )[0];

    if (existedUser) {
      return either.error(
        new Error({
          message: `${await this.i18n.t('auth.USER_ALREADY_TAKEN', {
            args: { email: user.email },
          })}`,
        })
      );
    }

    const preparedUser = { ...user };
    await this.userQueryService.createOne(preparedUser);
    return either.of(
      new Success({
        message: `${await this.i18n.t('auth.REGISTER_SUCCESS')}`,
      })
    );
  }

  async login(
    email: string,
    password: string
  ): Promise<Either<Error, UserEntity>> {
    const user = (
      await this.userQueryService.query({
        filter: { email: { eq: email } },
      })
    )[0];
    if (!user) {
      return either.error(
        new Error({
          message: `${await this.i18n.t('auth.USER_NOT_FOUND_BY_EMAIL')}`,
        })
      );
    }
    if (!user.isActive) {
      return either.error(
        new Error({
          message: `${await this.i18n.t('auth.USER_NOT_ACTIVATED')}`,
        })
      );
    }
    if (!(await user?.comparePassword(password))) {
      return either.error(
        new Error({
          message: `${await this.i18n.t('auth.PASSWORD_WRONG')}`,
        })
      );
    }
    return either.of(user);
  }

  async signToken(user: UserEntity): Promise<AuthUserResponse> {
    const payload = { email: user.email, sub: user.id, id: user.id };
    return new AuthUserResponse({
      user,
      token: this.jwtService.sign(payload, { expiresIn: '1d' }),
    });
  }

  async refreshToken(input: InputRefreshToken): Promise<any> {
    try {
      if (!input.token) {
        return either.error(
          new Error({
            message: `${await this.i18n.t('auth.TOKEN_NOT_FOUND')}`,
          })
        );
      }
      const decoded: any = jwtDecode(input.token);
      if (!decoded.sub) {
        return either.error(
          new Error({
            message: `${await this.i18n.t('auth.TOKEN_NOT_FOUND')}`,
          })
        );
      }
      const user = await this.userQueryService.query({
        filter: { id: { eq: decoded.sub }, email: { eq: decoded.email } },
      });
      if (!user[0]) {
        return either.error(
          new Error({
            message: `${await this.i18n.t('auth.USER_NOT_FOUND')}`,
          })
        );
      }
      const jwtToken = await this.jwtService.sign(
        {
          sub: user[0].id,
          email: user[0].email,
        },
        { expiresIn: '1h' }
      );
      return either.of({
        __typename: 'RefreshTokenResponse',
        token: jwtToken,
      });
    } catch (error) {
      return either.error(new Error({ message: error }));
    }
  }

  async getRefreshToken(token: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(token, { ignoreExpiration: true });
      // console.log(payload);
      const userId = payload.sub;
      const user = await this.userQueryService.getById(userId);

      // User Not Found
      if (!user) {
        return either.error(
          new Error({ message: `${await this.i18n.t('user.USER_NOT_FOUND')}` })
        );
      }

      // User Not Activated
      if (!user.isActive) {
        return either.error(
          new Error({
            message: `${await this.i18n.t('auth.USER_NOT_ACTIVATED')}`,
          })
        );
      }

      // New Token
      return either.of(
        new AuthUserResponse({
          user,
          token: this.jwtService.sign(
            { email: user.email, sub: user.id },
            { expiresIn: '1d' }
          ),
        })
      );
    } catch (error) {
      return either.error(new Error(error));
    }
  }
}
