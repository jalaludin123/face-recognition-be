import { Module, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { UserEntity } from './user.entity';
import { UserDto } from './user.dto';

const nestjsQueryTypeOrmModule = NestjsQueryTypeOrmModule.forFeature([
  UserEntity,
]);

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [nestjsQueryTypeOrmModule],
      dtos: [{ DTOClass: UserDto }],
      resolvers: [
        {
          DTOClass: UserDto,
          EntityClass: UserEntity,
          read: {
            one: { name: 'user' },
            many: { name: 'users' },
          },
          pipes: [ValidationPipe],
        },
      ],
    }),
    nestjsQueryTypeOrmModule,
  ],
  exports: [nestjsQueryTypeOrmModule],
  providers: [UserService],
})
export class UserModule {}
