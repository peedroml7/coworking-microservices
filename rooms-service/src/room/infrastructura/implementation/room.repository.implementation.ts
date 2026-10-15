import { Injectable } from '@nestjs/common';
import { RoomRepository } from '../../domain/repository/room.repository';
import { CreateRoomInterface } from '../../domain/interface/create-room.intreface';
import { Room } from '../../domain/model/room';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from '../entity/room.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoomRepositoryImplementation implements RoomRepository {
  constructor(
    @InjectRepository(RoomEntity) private readonly orm: Repository<RoomEntity>,
  ) {}

  async getRooms(): Promise<Room[]> {
    return await this.orm.find();
  }

  async getRoom(id: string): Promise<Room | null> {
    return await this.orm.findOne({ where: { id } });
  }

  async createRoom(room: CreateRoomInterface): Promise<Room> {
    return await this.orm.save(room);
  }
}
