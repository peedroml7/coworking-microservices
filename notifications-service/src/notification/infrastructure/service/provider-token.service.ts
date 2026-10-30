import { Injectable } from '@nestjs/common';
import { HttpClient, InjectHttpClient } from '@nestjs/http-client';
import { HTTT_CLIENT_NAME } from '../constants/http-client-name.constant';
import { ConfigService } from '@nestjs/config';
import { ProviderTokenResponseInterface } from '../interface/provider-token-response.interface';

@Injectable()
export class ProviderTokenService {
  // Renew the token 10s before it expires so it never dies mid-request
  private static readonly EXPIRY_MARGIN_MS = 10_000;

  // Timestamp in ms when the cached token stops being valid
  private expiresAt = 0;

  private accessToken: string;
  private providerId: string;
  private providerSecret: string;

  constructor(
    @InjectHttpClient(HTTT_CLIENT_NAME)
    private readonly fakeProvider: HttpClient,
    private readonly configService: ConfigService,
  ) {
    this.providerId = this.configService.getOrThrow<string>('PROVIDER_ID');
    this.providerSecret =
      this.configService.getOrThrow<string>('PROVIDER_SECRET');
  }

  public async getToken(): Promise<string> {
    if (this.isTokenValid()) return this.accessToken!;

    const { data } =
      await this.fakeProvider.post<ProviderTokenResponseInterface>('/token', {
        json: {
          grant_type: 'client_credentials',
          client_id: this.providerId,
          client_secret: this.providerSecret,
        },
      });

    this.accessToken = data.access_token;
    // expires_in comes in seconds, Date.now() works in ms
    this.expiresAt = Date.now() + data.expires_in * 1000;

    return this.accessToken;
  }

  // It asks if the token will keep alive in 10s
  private isTokenValid(): boolean {
    return (
      // There is a cached token
      !!this.accessToken &&
      // And it will still be valid 10s from now
      Date.now() + ProviderTokenService.EXPIRY_MARGIN_MS < this.expiresAt
    );
  }
}
