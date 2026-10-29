export abstract class DomainError extends Error {
  abstract statusCode: number;
}
