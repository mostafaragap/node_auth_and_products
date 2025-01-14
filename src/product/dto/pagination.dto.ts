import { Type } from 'class-transformer';
import { IsInt, Min, IsOptional } from 'class-validator';

export class PaginationDto {

    @IsInt()
    @Type(() => Number)
    @Min(1)
    page: number;


    @IsInt()
    @Type(() => Number)
    @Min(1)
    limit: number;
}
