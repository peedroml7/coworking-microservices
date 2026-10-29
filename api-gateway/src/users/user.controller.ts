import { Body, Controller, Inject, Post } from '@nestjs/common';
import { USERS_SERVICE } from '../shared/external-clients.module';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDataInterface } from './interface/login-data.interface';
import { firstValueFrom, timeout } from 'rxjs';
import { LoginDto } from './dto/login.dto';

@Controller('users')
export class UserController {
  constructor(@Inject(USERS_SERVICE) private readonly service: ClientProxy) {}

  @Post()
  public async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<LoginDataInterface> {
    return firstValueFrom(
      this.service
        .send<LoginDataInterface>('user_created', createUserDto)
        .pipe(timeout(3000)),
    );
  }

  @Post('login')
  public async logIn(@Body() logInDto: LoginDto): Promise<LoginDataInterface> {
    return firstValueFrom(
      this.service
        .send<LoginDataInterface>('request_login', logInDto)
        .pipe(timeout(3000)),
    );
  }
}
