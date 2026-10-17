import { Inject, Injectable } from '@nestjs/common';
import { RoomGateway } from '../../domain/gateway/room.gateway';
import { Room } from '../../domain/model/room';
import { firstValueFrom, timeout } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { ROOMS_CLIENT } from '../token/tokens';

@Injectable()
export class RoomGatewayImplementation implements RoomGateway {
  constructor(@Inject(ROOMS_CLIENT) private readonly gateway: ClientProxy) {}

  public async findRoomById(id: string): Promise<Room> {
    return firstValueFrom(
      this.gateway.send<Room>('find_room_by_id', id).pipe(timeout(3000)),
    );
  }
}
