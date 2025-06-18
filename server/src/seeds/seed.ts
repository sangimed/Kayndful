import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  const demo: CreateUserDto = {
    phone: '1234567890',
    name: 'Demo User',
    password: 'password',
  } as any;
  await usersService.create(demo);
  await app.close();
}
bootstrap();
