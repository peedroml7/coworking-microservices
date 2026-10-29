import { User } from '../model/user';

export type CreateUseInterface = Omit<User, 'id'>;
