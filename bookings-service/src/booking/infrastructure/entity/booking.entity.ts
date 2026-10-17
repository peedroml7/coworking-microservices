import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Booking } from '../../domain/model/booking';
import { BookingStatusEnum } from '../../domain/enum/booking-status.enum';

@Entity('bookings')
export class BookingEntity implements Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  room_id: string;

  @Column()
  start: Date;

  @Column()
  end: Date;

  @Column()
  customer_email: string;

  @Column()
  status: BookingStatusEnum;

  @Column()
  total_price: number;
}
