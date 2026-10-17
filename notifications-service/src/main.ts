import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { DomainErrorFilter } from './notification/infrastructure/filter/domain-error.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.TCP_HOST ?? '0.0.0.0',
        port: Number(process.env.TCP_PORT),
      },
    },
  );

  app.useGlobalFilters(new DomainErrorFilter());

  await app.listen();
}
void bootstrap();
