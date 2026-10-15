import { Inject } from '@nestjs/common';
import {
  ROOM_REPOSITORY,
  type RoomRepository,
} from '../../domain/repository/room.repository';
import { Room } from '../../domain/model/room';
import { CreateRoomInterface } from '../../domain/interface/create-room.intreface';

export class RoomCreator {
  constructor(
    @Inject(ROOM_REPOSITORY) private readonly repository: RoomRepository,
  ) {}

  public async createRoom(room: CreateRoomInterface): Promise<Room> {
    return await this.repository.createRoom(room);
  }
}
