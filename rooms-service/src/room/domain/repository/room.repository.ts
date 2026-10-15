import { CreateRoomInterface } from '../interface/create-room.intreface';
import { Room } from '../model/room';

export const ROOM_REPOSITORY = Symbol('ROOM_REPOSITORY');

export interface RoomRepository {
  getRooms(): Promise<Room[]>;
  getRoom(id: string): Promise<Room | null>;
  createRoom(room: CreateRoomInterface): Promise<Room>;
}
