import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, MinLength, IsIn } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address of the new user.',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Aa!123456',
    description: 'The password for the user account.',
    minLength: 6,
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    example: 'user',
    description: 'The role of the user. Can either be "user" or "admin". Defaults to "user" if not provided.',
    enum: ['user', 'admin'], // Explicitly list allowed values for Swagger
  })
  @IsOptional()
  @IsNotEmpty()
  @IsIn(["user", "admin"])
  role?: string = 'user'; // Default role
}
