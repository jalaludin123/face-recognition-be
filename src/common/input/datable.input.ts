import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsEnum, IsOptional, Max } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { enumToDesc } from '../utils/object-helpers';

export enum SortingDirectionType {
  ASC = 'ASC',
  DESC = 'DESC',
}

@InputType('PagingInput')
export class PagingInput {
  @Field(() => Int, { defaultValue: 10, description: 'max 50' })
  @Max(50)
  limit: number;
  @Field(() => Int, { nullable: true })
  offset: number;
}

@InputType('eqFilter')
export class EqFilter {
  @Field({ nullable: true })
  @IsOptional()
  eq: string;
}

@InputType('likeFilter')
export class LikeFilter {
  @Field({ nullable: true })
  like: string;
}

@InputType('iLikeFilter')
export class ILikeFilter {
  @Field({ nullable: true })
  iLike: string;
}

@InputType('isFilter')
export class IsFilter {
  @Field({ nullable: true })
  is: boolean;
}

@InputType('DirectionSorting')
export class DirectionSorting {
  @Field({ description: enumToDesc(SortingDirectionType), nullable: true })
  @IsEnum(SortingDirectionType, {
    message: i18nValidationMessage('validation.NOT_REGISTERED'),
  })
  direction: string;
}
@ObjectType('navigatePages')
export class NavigatePages {
  @Field()
  hasNextPage: boolean;

  @Field()
  hasPreviousPage: boolean;
}
