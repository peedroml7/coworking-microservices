import { DomainError } from './domain-error';

export class EmailNotFoundError extends DomainError {
  readonly statusCode: number = 404;

  constructor() {
    super('User with provided email not found');
  }
}
