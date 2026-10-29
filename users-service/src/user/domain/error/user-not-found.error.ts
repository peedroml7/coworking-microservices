import { DomainError } from './domain.error';

export class UserNotFoundError extends DomainError {
  statusCode: number = 404;

  constructor(id: string) {
    super(`User with id: ${id} not found`);
  }
}
