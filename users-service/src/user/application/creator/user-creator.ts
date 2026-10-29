import { Inject } from '@nestjs/common';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../../domain/repository/user.repository';
import { CreateUseInterface } from '../../domain/interface/create-user.interface';
import { LoginDataInterface } from '../../domain/interface/login-data.interface';
import { User } from '../../domain/model/user';

export class UserCreator {
  constructor(
    @Inject(USER_REPOSITORY) private readonly repository: UserRepository,
  ) {}

  private argon2 = require('argon2');

  public async create(
    createUser: CreateUseInterface,
  ): Promise<LoginDataInterface> {
    const user: User = await this.repository.create({
      ...createUser,
      password: await this.argon2.hash(createUser.password),
    });

    return { access_token: '' };
  }
}
