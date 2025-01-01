import { Args } from '@nestjs/graphql';

export const Paging = () => Args('paging', { nullable: true });
