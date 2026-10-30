import { Processor, WorkerHost } from '@nestjs/bullmq';
import { NOTIFICATION_QUEUE } from '../constants/notification-queue.constant';
import { Job, UnrecoverableError } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import {
  HttpClient,
  HttpResponseError,
  InjectHttpClient,
} from '@nestjs/http-client';
import { HTTT_CLIENT_NAME } from '../constants/http-client-name.constant';

@Processor(NOTIFICATION_QUEUE)
export class BullMQNotificationProcessor extends WorkerHost {
  private providerId: string;
  private providerSecret: string;

  constructor(
    @InjectHttpClient(HTTT_CLIENT_NAME)
    private readonly fakeProvider: HttpClient,
    private readonly configService: ConfigService,
  ) {
    super();
    this.providerId = this.configService.getOrThrow<string>('PROVIDER_ID');
    this.providerSecret =
      this.configService.getOrThrow<string>('PROVIDER_SECRET');
  }

  async process(job: Job): Promise<any> {
    try {
      const { data: token } = await this.getToken();

      await this.fakeProvider.post('/send', {
        headers: { Authorization: `Bearer ${token.access_token}` },
        json: job.data,
      });
    } catch (error: unknown) {
      const isClientError =
        error instanceof HttpResponseError &&
        error.status >= 400 &&
        error.status < 500 &&
        error.status !== 429;

      // 4xx except 429 will fail the same way again, so skip retries
      if (isClientError) {
        throw new UnrecoverableError(
          `Provider rejected job ${job.id}: ${error.status}`,
        );
      }

      // 5xx, 429, timeouts and network errors are retried by BullMQ
      throw error;
    }
  }

  private async getToken(): Promise<any> {
    return await this.fakeProvider.post<any>('/token', {
      json: {
        grant_type: 'client_credentials',
        client_id: this.providerId,
        client_secret: this.providerSecret,
      },
    });
  }
}
