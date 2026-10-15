import {
  IsEmail,
  IsISO8601,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  room_id: string;

  @IsNotEmpty()
  @IsISO8601({ strict: true })
  start: Date;

  @IsNotEmpty()
  @IsISO8601({ strict: true })
  end: Date;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  customer_email: string;
}
