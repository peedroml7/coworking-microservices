import { Room } from '../model/room';

export const ROOM_GATEWAY = Symbol('ROOM_GATEWAY');

export interface RoomGateway {
  findRoomById(id: string): Promise<Room>;
}
