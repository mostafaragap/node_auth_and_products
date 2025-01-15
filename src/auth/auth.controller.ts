import { Body, Controller, Post, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../guards/auth.guard';
import { LoginUserDto, RegisterUserDto } from './dto';
import { User } from './decorators/user.decorator';

@ApiTags('Auth') // Group all endpoints under "Auth"
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered.',
    schema: {
      example: {
        id: 1,
        email: 'user@example.com',
        role: 'user',
        createdAt: '2025-01-14T12:34:56.789Z',
        updatedAt: '2025-01-14T12:34:56.789Z',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'User already registered.',
  })
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in.',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGUiOiJ1c2VyIi.....',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials.',
  })
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the profile of the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully.',
    schema: {
      example: {
        id: 1,
        email: 'user@example.com',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@User() user: any) {
    return user;
  }
}
