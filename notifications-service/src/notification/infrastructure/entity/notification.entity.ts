import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Notification } from '../../domain/model/notification';

@Entity('notifications')
export class NotificationEntity implements Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  booking_id: string;

  @Column()
  room_id: string;

  @Column()
  text: string;

  @Column()
  customer_email: string;
}
