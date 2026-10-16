import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Booking } from '../../domain/model/booking';

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
}
