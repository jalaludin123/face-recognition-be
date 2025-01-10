import { Args } from '@nestjs/graphql';

export const Sorting = (Input: Function) =>
  Args({ name: 'sorting', type: () => [Input] });
