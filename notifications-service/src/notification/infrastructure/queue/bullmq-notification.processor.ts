import { Processor, WorkerHost } from '@nestjs/bullmq';
import { NOTIFICATION_QUEUE } from '../constants/notification-queue.constant';
import { Job, UnrecoverableError } from 'bullmq';
import {
  HttpClient,
  HttpResponseError,
  InjectHttpClient,
} from '@nestjs/http-client';
import { HTTT_CLIENT_NAME } from '../constants/http-client-name.constant';
import { ProviderTokenService } from '../service/provider-token.service';

@Processor(NOTIFICATION_QUEUE)
export class BullMQNotificationProcessor extends WorkerHost {
  constructor(
    @InjectHttpClient(HTTT_CLIENT_NAME)
    private readonly fakeProvider: HttpClient,
    private readonly providerTokenService: ProviderTokenService,
  ) {
    super();
  }

  async process(job: Job): Promise<any> {
    try {
      const token: string = await this.providerTokenService.getToken();

      await this.fakeProvider.post('/send', {
        headers: { Authorization: `Bearer ${token}` },
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
}
