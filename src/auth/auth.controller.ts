import { Body, Controller, Post, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from '../guards/auth.guard';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';


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
  getProtectedData() {
    return { message: 'This is protected data!' };
  }
}
