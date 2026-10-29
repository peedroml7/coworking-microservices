import { Inject } from '@nestjs/common';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../../domain/repository/user.repository';
import { User } from '../../domain/model/user';
import { UserNotFoundError } from '../../domain/error/user-not-found.error';

export class UserFinder {
  constructor(
    @Inject(USER_REPOSITORY) private readonly repository: UserRepository,
  ) {}

  public async findOne(id: string): Promise<User> {
    const user: User = await this.repository.findOne(id);

    if (!user) throw new UserNotFoundError(id);

    return user;
  }
}
