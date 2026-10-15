import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { RoomInterface } from './interface/room.interface';
import { CreateRoomDto } from './dto/create-room.dto';
import { ROOMS_SERVICE } from '../shared/external-clients.module';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

@Controller('rooms')
export class RoomController {
  constructor(@Inject(ROOMS_SERVICE) private readonly service: ClientProxy) {}

  @Get()
  public async getRooms(): Promise<RoomInterface[]> {
    return firstValueFrom(
      this.service
        .send<RoomInterface[]>(null, 'find_rooms')
        .pipe(timeout(3000)),
    );
  }

  @Get(':id')
  public async getRoom(@Param('id') id: string): Promise<RoomInterface> {
    return firstValueFrom(
      this.service
        .send<RoomInterface>(id, 'find_room_by_id')
        .pipe(timeout(3000)),
    );
  }

  @Post()
  public async createRoom(
    @Body() createRoomDto: CreateRoomDto,
  ): Promise<RoomInterface> {
    return firstValueFrom(
      this.service
        .send<RoomInterface>(createRoomDto, 'create_room')
        .pipe(timeout(3000)),
    );
  }
}
