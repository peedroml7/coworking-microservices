import { Inject, NotFoundException } from '@nestjs/common';
import { Room } from '../../domain/model/room';
import {
  ROOM_REPOSITORY,
  type RoomRepository,
} from '../../domain/repository/room.repository';
import { AvailabilityInterface } from '../../domain/interface/availability.interface';

export class RoomFinder {
  constructor(
    @Inject(ROOM_REPOSITORY) private readonly repository: RoomRepository,
  ) {}

  public async getRooms(): Promise<Room[]> {
    return await this.repository.getRooms();
  }

  public async getRoom(id: string): Promise<Room> {
    const room: Room | null = await this.repository.getRoom(id);

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return room;
  }
}
