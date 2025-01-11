import { Field, ObjectType } from '@nestjs/graphql';
import { UserDto } from '../master/user/user.dto';

@ObjectType()
export class AuthUserResponse {
  @Field(() => UserDto)
  user: UserDto;

  @Field()
  token: string;

  constructor(partial?: Partial<AuthUserResponse>) {
    Object.assign(this, partial);
  }
}

@ObjectType()
export class AuthAppleResponse {
  @Field()
  token: string;
}

@ObjectType()
export class RefreshTokenResponse {
  @Field()
  token: string;
}
