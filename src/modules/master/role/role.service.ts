import { QueryService } from '@nestjs-query/core';
import { RoleEntity } from './role.entity';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@QueryService(RoleEntity)
export class RoleService extends TypeOrmQueryService<RoleEntity> {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>
  ) {
    super(roleRepository, { useSoftDelete: true });
  }
}
