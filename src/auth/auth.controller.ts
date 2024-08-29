import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/CreateUserDto';
import { LoginDto } from './dto/LoginDto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() data: CreateUserDto) {
    return await this.authService.RegisterUserService(data);
  }

  @Post('login')
  async login(@Body() data: LoginDto) {
    return await this.authService.login(data);
  }

  @UseGuards(AuthGuard)
  @Post('profile')
  async profile(@Body() data: number) {
    return await this.authService.ProfileDetailService(data);
  }
}
