import { Inject, Injectable } from '@nestjs/common';
import { RoomGateway } from '../../domain/gateway/room.gateway';
import { Room } from '../../domain/model/room';
import { firstValueFrom, timeout } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { ROOMS_CLIENT } from '../token/tokens';
import { RoomNotFoundError } from '../../domain/error/room-not-found.error';

@Injectable()
export class RoomGatewayImplementation implements RoomGateway {
  constructor(@Inject(ROOMS_CLIENT) private readonly gateway: ClientProxy) {}

  public async findRoomById(id: string): Promise<Room> {
    try {
      return await firstValueFrom(
        this.gateway.send<Room>('find_room_by_id', id).pipe(timeout(3000)),
      );
    } catch {
      throw new RoomNotFoundError(id);
    }
  }
}
