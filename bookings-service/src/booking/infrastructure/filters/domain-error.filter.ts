import { Catch, RpcExceptionFilter } from '@nestjs/common';
import { DomainError } from '../../domain/error/domain.error';
import { Observable, throwError } from 'rxjs';

@Catch(DomainError)
export class DomainErrorFilter implements RpcExceptionFilter<DomainError> {
  catch(error: DomainError): Observable<never> {
    return throwError(() => ({
      statusCode: error.statusCode,
      message: error.message,
    }));
  }
}
