import { Injectable } from '@nestjs/common';
import { BookingRepository } from '../../domain/repository/booking.repository';
import { CreateBookingInterface } from '../../domain/interface/create-booking.interface';
import { Booking } from '../../domain/model/booking';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingEntity } from '../entity/booking.entity';
import { LessThan, MoreThan, Repository } from 'typeorm';

@Injectable()
export class BookingRespositoryImplementation implements BookingRepository {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly orm: Repository<BookingEntity>,
  ) {}

  public async findOne(id: string): Promise<Booking | null> {
    return await this.orm.findOne({ where: { id } });
  }

  public async create(booking: CreateBookingInterface): Promise<Booking> {
    return await this.orm.save(booking);
  }

  public async delete(id: string): Promise<boolean> {
    const result = await this.orm.delete({ id });
    return (result.affected ?? 0) > 0;
  }

  public async hasOverlap(
    room_id: string,
    start: Date,
    end: Date,
  ): Promise<boolean> {
    return this.orm.exists({
      where: { room_id, start: LessThan(end), end: MoreThan(start) },
    });
  }
}
