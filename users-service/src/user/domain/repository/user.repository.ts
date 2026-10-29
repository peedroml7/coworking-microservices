import { CreateUseInterface } from '../interface/create-user.interface';
import { User } from '../model/user';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRepository {
  findOne(id: string): Promise<User>;
  create(createUserInterface: CreateUseInterface): Promise<User>;
}
