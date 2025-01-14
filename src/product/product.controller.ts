import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { JwtAuthGuard } from '../guards/auth.guard';
import { CreateProductDto, PaginationDto, UpdateProductDto } from './dto';

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post()
    async create(@Body() createProductDto: CreateProductDto) {
        return this.productService.create(createProductDto);
    }

    @Get()
    async findAll(@Query() paginationDto: PaginationDto) {
        return this.productService.findAll(+paginationDto.page, +paginationDto.limit);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.productService.findOne(+id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
        return this.productService.update(+id, updateProductDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return this.productService.delete(+id);
    }
}
