import { Module } from '@nestjs/common';
import { RoomController } from './controller/room.controller';
import { RoomCreator } from '../application/creators/room-creator';
import { RoomFinder } from '../application/finders/room-finder';
import { ROOM_REPOSITORY } from '../domain/repository/room.repository';
import { RoomRepositoryImplementation } from './implementation/room.repository.implementation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from './entity/room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoomEntity])],
  controllers: [RoomController],
  providers: [
    RoomCreator,
    RoomFinder,
    { provide: ROOM_REPOSITORY, useClass: RoomRepositoryImplementation },
  ],
})
export class RoomModule {}
