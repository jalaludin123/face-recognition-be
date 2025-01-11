import { Field, InputType, PickType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail({}, { message: i18nValidationMessage('validation.INVALID_EMAIL') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  email: string;

  @Field()
  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  name: string;

  @Field()
  @MinLength(6, {
    message: i18nValidationMessage('validation.MIN_LENGTH'),
  })
  password: string;

  @Field({ nullable: true })
  @IsString({ message: i18nValidationMessage('validation.STRING') })
  username: string;
}

@InputType()
export class LoginInput extends PickType(
  RegisterInput,
  ['email', 'password'],
  InputType
) {}

@InputType()
export class InputRefreshToken {
  @Field()
  token: string;
}
