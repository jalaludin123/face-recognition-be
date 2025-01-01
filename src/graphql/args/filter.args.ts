import { Args } from '@nestjs/graphql';

export const Filter = () => Args('filter', { nullable: true });
