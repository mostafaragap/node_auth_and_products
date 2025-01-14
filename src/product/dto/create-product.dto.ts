import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'Laptop',
    description: 'The name of the product.',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'A high-performance laptop suitable for gaming and work.',
    description: 'The description of the product.',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    example: 999.99,
    description: 'The price of the product.',
    minimum: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: 50,
    description: 'The stock quantity of the product.',
    minimum: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  stock: number;
}
