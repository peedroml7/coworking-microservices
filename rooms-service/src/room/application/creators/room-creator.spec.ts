import { RoomCreator } from './room-creator';
import { RoomRepository } from '../../domain/repository/room.repository';
import { Room } from '../../domain/model/room';
import { CreateRoomInterface } from '../../domain/interface/create-room.intreface';

class InMemoryRoomRepository implements RoomRepository {
  readonly rooms: Room[] = [];

  getRooms(): Promise<Room[]> {
    return Promise.resolve(this.rooms);
  }

  getRoom(id: string): Promise<Room | null> {
    return Promise.resolve(this.rooms.find((room) => room.id === id) ?? null);
  }

  createRoom(data: CreateRoomInterface): Promise<Room> {
    const room: Room = { id: `room-${this.rooms.length + 1}`, ...data };
    this.rooms.push(room);
    return Promise.resolve(room);
  }
}

describe('RoomCreator', () => {
  it('saves the room and returns it with an id', async () => {
    const repository = new InMemoryRoomRepository();
    const creator = new RoomCreator(repository);

    const room = await creator.createRoom({
      name: 'Focus room',
      capacity: 2,
      price_per_hour: 8,
    });

    expect(room.id).toBe('room-1');
    expect(room.name).toBe('Focus room');
    expect(repository.rooms).toHaveLength(1);
  });
});
