import { Controller, Post, Body, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserDto } from '../users/dto/user.dto';
import { toUserDto } from '../utils/mappers';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private usersService: UsersService) {}

  @Post('register')
  async register(@Body() dto: CreateUserDto): Promise<AuthResponseDto> {
    const user = await this.usersService.create(dto);
    return this.authService.login(user);
  }

  @Post('login')
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.authService.validateUser(dto.phone, dto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid phone or password');
    }
    return this.authService.login(user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('profile')
  async profile(@Req() req: any): Promise<UserDto> {
    const user = await this.usersService.findOne(req.user.userId);
    return toUserDto(user);
  }

  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto): Promise<AuthResponseDto> {
    return this.authService.refreshToken(dto.refreshToken);
  }
}
