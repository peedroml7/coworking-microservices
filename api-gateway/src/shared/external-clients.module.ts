import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientsModule,
  ClientsProviderAsyncOptions,
  Transport,
} from '@nestjs/microservices';

export const BOOKINGS_SERVICE = Symbol('BOOKINGS_SERVICE');
export const ROOMS_SERVICE = Symbol('ROOMS_SERVICE');
export const NOTIFICATIONS_SERVICE = Symbol('NOTIFICATIONS_SERVICE');
export const USERS_SERVICE = Symbol('USERS_SERVICE');

const tcpClient = (
  name: symbol,
  prefix: string,
): ClientsProviderAsyncOptions => ({
  name,
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    transport: Transport.TCP,
    options: {
      host: config.getOrThrow<string>(`${prefix}_HOST`),
      port: Number(config.getOrThrow<string>(`${prefix}_PORT`)),
    },
  }),
});

@Module({
  imports: [
    ClientsModule.registerAsync([
      tcpClient(BOOKINGS_SERVICE, 'BOOKINGS'),
      tcpClient(ROOMS_SERVICE, 'ROOMS'),
      tcpClient(NOTIFICATIONS_SERVICE, 'NOTIFICATIONS'),
      tcpClient(USERS_SERVICE, 'USERS'),
    ]),
  ],
  exports: [ClientsModule],
})
export class ExternalClientsModule {}
