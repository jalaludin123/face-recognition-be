import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { ValidateInput } from '@/src/common/decorators/validate-input.decorator';
import {
  GetRefreshTokenResultUnion,
  LoginUserResultUnion,
  RefreshTokenResultUnion,
  RegisterUserResultUnion,
} from './auth.result';
import { Input } from '@/src/graphql/args/input.args';
import { InputRefreshToken, LoginInput, RegisterInput } from './auth.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @ValidateInput()
  @Mutation(() => [RegisterUserResultUnion])
  async register(
    @Input() input: RegisterInput
  ): Promise<Array<typeof RegisterUserResultUnion>> {
    const result = await this.authService.registerUser(input);
    return [result.value];
  }

  @ValidateInput()
  @Mutation(() => [LoginUserResultUnion])
  async login(
    @Input() input: LoginInput
  ): Promise<Array<typeof LoginUserResultUnion>> {
    const result = await this.authService.login(input.email, input.password);
    if (result.isError()) {
      return [result.value];
    }
    return [await this.authService.signToken(result.value)];
  }

  @Mutation(() => [RefreshTokenResultUnion])
  async refreshToken(
    @Input() input: InputRefreshToken
  ): Promise<Array<typeof RefreshTokenResultUnion>> {
    const result = await this.authService.refreshToken(input);
    return [result.value];
  }

  @Query(() => [GetRefreshTokenResultUnion])
  async getRefreshToken(
    @Args('token') token: string
  ): Promise<Array<typeof GetRefreshTokenResultUnion>> {
    const result = await this.authService.getRefreshToken(token);
    return [result.value];
  }
}
