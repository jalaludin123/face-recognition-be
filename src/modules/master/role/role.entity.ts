import { BaseEntity } from '@/src/config/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'm_role' })
export class RoleEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  desc: string;
}
