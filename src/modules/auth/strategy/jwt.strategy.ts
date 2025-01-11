import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import jwtConfig from '../../../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { AuthTypes } from '../auth.types';
import { InjectQueryService, QueryService } from '@nestjs-query/core';
import { UserEntity } from '../../../modules/master/user/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, AuthTypes.JWT) {
  constructor(
    @Inject(jwtConfig.KEY)
    jwtConf: ConfigType<typeof jwtConfig>,
    @InjectQueryService(UserEntity)
    private userQueryService: QueryService<UserEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConf.secret,
    });
  }

  async validate(payload: any, done: VerifiedCallback) {
    const user = (
      await this.userQueryService.query({
        filter: { email: { eq: payload.email } },
      })
    )[0];
    if (!user) {
      return done(new UnauthorizedException(), false);
    }
    return done(null, user);
  }
}
