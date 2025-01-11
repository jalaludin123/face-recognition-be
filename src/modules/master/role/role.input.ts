import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

@InputType('RoleSync')
export class RoleInput {
  @Field()
  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  name: string;

  @Field({ nullable: true })
  desc: string;
}
