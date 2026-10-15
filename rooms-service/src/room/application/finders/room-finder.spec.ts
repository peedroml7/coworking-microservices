import { NotFoundException } from '@nestjs/common';
import { RoomFinder } from './room-finder';
import { RoomRepository } from '../../domain/repository/room.repository';
import { Room } from '../../domain/model/room';

class InMemoryRoomRepository implements RoomRepository {
  constructor(private readonly rooms: Room[] = []) {}

  getRooms(): Promise<Room[]> {
    return Promise.resolve(this.rooms);
  }

  getRoom(id: string): Promise<Room | null> {
    return Promise.resolve(this.rooms.find((room) => room.id === id) ?? null);
  }

  createRoom(): Promise<Room> {
    throw new Error('Not used in these tests');
  }
}

const meetingRoom: Room = {
  id: 'room-1',
  name: 'Meeting room',
  capacity: 6,
  price_per_hour: 20,
};

describe('RoomFinder', () => {
  it('returns every room', async () => {
    const finder = new RoomFinder(new InMemoryRoomRepository([meetingRoom]));

    await expect(finder.getRooms()).resolves.toEqual([meetingRoom]);
  });

  it('returns a room by id', async () => {
    const finder = new RoomFinder(new InMemoryRoomRepository([meetingRoom]));

    await expect(finder.getRoom('room-1')).resolves.toEqual(meetingRoom);
  });

  it('throws when the room does not exist', async () => {
    const finder = new RoomFinder(new InMemoryRoomRepository());

    await expect(finder.getRoom('missing')).rejects.toThrow(NotFoundException);
  });
});
