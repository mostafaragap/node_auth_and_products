import { Body, Controller, Post, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../guards/auth.guard';
import { LoginUserDto, RegisterUserDto } from './dto';
import { User } from './decorators/user.decorator';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProtectedData(@User() user: any) {
    return user
  }
}
