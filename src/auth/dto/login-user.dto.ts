import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address of the user.',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Aa!123456',
    description: 'The password of the user.',
  })
  @IsNotEmpty()
  password: string;
}
