import { UserEntity } from '../master/user/user.entity';

export const AuthTypes = {
  JWT: 'jwt',
};

export type AuthenticatedUser = Pick<UserEntity, 'id' | 'email' | 'role_id'>;

export type JwtPayload = {
  id: string;
  sub: string;
  email: string;
  role_id: string;
  // role:Role;
};

export type UserContext = {
  req: {
    user: AuthenticatedUser;
  };
};
