import {
  FilterableField,
  IDField,
  PagingStrategies,
  QueryOptions,
} from '@nestjs-query/query-graphql';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('roleSync')
@QueryOptions({
  pagingStrategy: PagingStrategies.OFFSET,
  enableTotalCount: true,
})
export class RoleDto {
  @IDField(() => ID)
  id: string;

  @FilterableField()
  name: string;

  @Field({ nullable: true })
  desc: string;
}
