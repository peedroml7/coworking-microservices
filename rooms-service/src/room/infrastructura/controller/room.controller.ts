import { Controller } from '@nestjs/common';
import { RoomFinder } from '../../application/finders/room-finder';
import { RoomCreator } from '../../application/creators/room-creator';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { type CreateRoomInterface } from '../../domain/interface/create-room.intreface';

@Controller()
export class RoomController {
  constructor(
    private readonly roomFinder: RoomFinder,
    private readonly roomCreator: RoomCreator,
  ) {}

  @MessagePattern('find_rooms')
  public async getRooms() {
    return await this.roomFinder.getRooms();
  }

  @MessagePattern('find_room_by_id')
  public async getRoom(@Payload() data: string) {
    return await this.roomFinder.getRoom(data);
  }

  @MessagePattern('create_room')
  public async createRoom(@Payload() data: CreateRoomInterface) {
    return await this.roomCreator.createRoom(data);
  }
}
