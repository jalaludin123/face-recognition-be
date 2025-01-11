import { InputType, OmitType } from '@nestjs/graphql';
import { UserDto } from './user.dto';

@InputType('UserSync')
export class UserInput extends OmitType(
  UserDto,
  ['id', 'role_id', 'isActive'],
  InputType
) {}
