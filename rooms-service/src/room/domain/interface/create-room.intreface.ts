import { Room } from '../model/room';

export type CreateRoomInterface = Omit<Room, 'id'>;
