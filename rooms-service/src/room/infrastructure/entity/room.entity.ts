import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Room } from '../../domain/model/room';

@Entity('rooms')
export class RoomEntity implements Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  capacity: number;

  @Column()
  price_per_hour: number;
}
