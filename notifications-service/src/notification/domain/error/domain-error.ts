export abstract class DomainError extends Error {
  abstract readonly statusCode: number;
}
