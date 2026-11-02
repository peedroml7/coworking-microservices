import { HttpClient } from '@nestjs/http-client';
import { ConfigService } from '@nestjs/config';
import { ProviderTokenService } from './provider-token.service';

describe('ProviderTokenService', () => {
  let service: ProviderTokenService;
  let httpClient: { post: jest.Mock };

  beforeEach(() => {
    httpClient = {
      post: jest.fn().mockResolvedValue({
        data: { access_token: 'token-1', expires_in: 60 },
      }),
    };
    const configService = { getOrThrow: jest.fn().mockReturnValue('x') };

    service = new ProviderTokenService(
      httpClient as unknown as HttpClient,
      configService as unknown as ConfigService,
    );
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it.todo('asks the provider for a token the first time');

  it.todo('reuses the cached token on the second call');

  it.todo('keeps the cached token when it is valid for more than 10s');

  it.todo('asks for a new token when less than 10s are left');

  it.todo('asks for a new token after invalidateToken()');
});
