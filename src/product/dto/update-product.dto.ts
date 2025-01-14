import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiPropertyOptional({
    example: 'Updated Laptop',
    description: 'The updated name of the product (optional).',
  })
  name?: string;

  @ApiPropertyOptional({
    example: 'An updated description of the product (optional).',
    description: 'The updated description of the product.',
  })
  description?: string;

  @ApiPropertyOptional({
    example: 1500.99,
    description: 'The updated price of the product (optional).',
    minimum: 0,
  })
  price?: number;

  @ApiPropertyOptional({
    example: 100,
    description: 'The updated stock quantity of the product (optional).',
    minimum: 0,
  })
  stock?: number;
}
