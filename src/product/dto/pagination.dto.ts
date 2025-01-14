import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    example: 1,
    description: 'The page number to retrieve. Must be an integer greater than or equal to 1.',
    minimum: 1,
  })
  @IsInt()
  @Type(() => Number)
  @Min(1)
  page: number;

  @ApiProperty({
    example: 10,
    description: 'The number of items per page. Must be an integer greater than or equal to 1.',
    minimum: 1,
  })
  @IsInt()
  @Type(() => Number)
  @Min(1)
  limit: number;
}
