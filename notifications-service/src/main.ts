import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { DomainErrorFilter } from './notification/infrastructure/filter/domain-error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: process.env.TCP_HOST ?? '0.0.0.0',
      port: Number(process.env.TCP_PORT),
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL!],
      queue: 'notifications_queue',
      queueOptions: { durable: true },
      noAck: false,
    },
  });

  app.useGlobalFilters(new DomainErrorFilter());

  await app.startAllMicroservices();
  await app.init();
}
void bootstrap();
