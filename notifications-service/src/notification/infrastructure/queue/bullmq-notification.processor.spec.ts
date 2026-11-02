import { Job, UnrecoverableError } from 'bullmq';
import {
  HttpClient,
  HttpResponseError,
  HttpTimeoutError,
} from '@nestjs/http-client';
import { BullMQNotificationProcessor } from './bullmq-notification.processor';
import { ProviderTokenService } from '../service/provider-token.service';

// Builds the error the http client throws for a non 2xx response
const responseError = (status: number): HttpResponseError =>
  new HttpResponseError({ method: 'POST', url: '/send', status });

const job = {
  id: 'event-1',
  data: { event_id: 'event-1', to: 'ana@example.com', subject: 'Hi' },
} as Job;

describe('BullMQNotificationProcessor', () => {
  let processor: BullMQNotificationProcessor;
  let httpClient: { post: jest.Mock };
  let tokenService: { getToken: jest.Mock; invalidateToken: jest.Mock };

  beforeEach(() => {
    httpClient = { post: jest.fn().mockResolvedValue({ data: {} }) };
    tokenService = {
      getToken: jest.fn().mockResolvedValue('token-1'),
      invalidateToken: jest.fn(),
    };

    processor = new BullMQNotificationProcessor(
      httpClient as unknown as HttpClient,
      tokenService as unknown as ProviderTokenService,
    );
  });

  it.todo('posts to /send with the bearer token and the idempotency key');

  it.todo('renews the token and sends again once after a 401');

  it.todo('throws UnrecoverableError when the retry also gets a 401');

  it.todo('throws UnrecoverableError on a 400');

  it.todo('rethrows a 429 so BullMQ retries it');

  it.todo('rethrows a 500 so BullMQ retries it');

  it.todo('rethrows a timeout so BullMQ retries it');

  it.todo('throws UnrecoverableError when /token answers 401');
});
