import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { RoleEntity } from './role.entity';
import { RoleDto } from './role.dto';
import { RoleInput } from './role.input';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      services: [RoleService],
      imports: [NestjsQueryTypeOrmModule.forFeature([RoleEntity])],
      resolvers: [
        {
          DTOClass: RoleDto,
          ServiceClass: RoleService,
          EntityClass: RoleEntity,
          CreateDTOClass: RoleInput,
          UpdateDTOClass: RoleInput,
          read: {
            one: { name: 'role' },
            many: { name: 'roles' },
          },
        },
      ],
    }),
  ],
  providers: [RoleService],
})
export class RoleModule {}
