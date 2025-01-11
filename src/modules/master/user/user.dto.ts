import {
  FilterableField,
  FilterableUnPagedRelation,
  IDField,
  PagingStrategies,
  QueryOptions,
} from '@nestjs-query/query-graphql';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsEmail, MinLength } from 'class-validator';
import { RoleDto } from '../role/role.dto';

@ObjectType('userSync')
@FilterableUnPagedRelation('role', () => RoleDto, {
  disableRemove: true,
  disableUpdate: true,
  nullable: true,
})
@QueryOptions({ pagingStrategy: PagingStrategies.OFFSET })
export class UserDto {
  @IDField(() => ID)
  id?: string;

  @IsEmail()
  @FilterableField()
  email!: string;

  @FilterableField()
  name!: string;

  @FilterableField()
  username!: string;

  @MinLength(6)
  @Field()
  password!: string;

  @FilterableField({
    nullable: true,
  })
  role_id: string;

  @IsBoolean()
  @Field()
  isActive!: boolean;
}
