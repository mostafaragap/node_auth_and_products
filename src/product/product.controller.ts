import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    UseGuards,
    UseInterceptors,
  } from '@nestjs/common';
  import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
  import { ProductService } from './product.service';
  import { Roles } from '../auth/decorators/roles.decorator';
  import { RolesGuard } from '../guards/roles.guard';
  import { JwtAuthGuard } from '../guards/auth.guard';
  import { CreateProductDto, PaginationDto, UpdateProductDto } from './dto';
  import { CacheInterceptor } from 'src/interceptors/cache.interceptor';
  
  @ApiTags('Products') // Groups all routes under the "Products" section in Swagger
  @Controller('products')
  export class ProductController {
    constructor(private readonly productService: ProductService) {}
  
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new product' })
    @ApiResponse({
      status: 201,
      description: 'The product has been successfully created.',
    })
    @ApiResponse({
      status: 401,
      description: 'Unauthorized access.',
    })
    @ApiResponse({
      status: 403,
      description: 'Forbidden: Only admins can create products.',
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post()
    async create(@Body() createProductDto: CreateProductDto) {
      return this.productService.create(createProductDto);
    }
  
    @ApiOperation({ summary: 'Get all products with pagination' })
    @ApiQuery({
      name: 'page',
      type: Number,
      description: 'The page number to retrieve.',
      example: 1,
    })
    @ApiQuery({
      name: 'limit',
      type: Number,
      description: 'The number of products per page.',
      example: 10,
    })
    @ApiResponse({
      status: 200,
      description: 'Successfully retrieved the list of products.',
    })
    @UseInterceptors(CacheInterceptor)
    @Get()
    async findAll(@Query() paginationDto: PaginationDto) {
      return this.productService.findAll(+paginationDto.page, +paginationDto.limit);
    }
  
    @ApiOperation({ summary: 'Get a single product by ID' })
    @ApiResponse({
      status: 200,
      description: 'Successfully retrieved the product.',
    })
    @ApiResponse({
      status: 404,
      description: 'Product not found.',
    })
    @UseInterceptors(CacheInterceptor)
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
      return this.productService.findOne(+id);
    }
  
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a product' })
    @ApiResponse({
      status: 200,
      description: 'The product has been successfully updated.',
    })
    @ApiResponse({
      status: 404,
      description: 'Product not found.',
    })
    @ApiResponse({
      status: 403,
      description: 'Forbidden: Only admins can update products.',
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Put(':id')
    async update(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateProductDto: UpdateProductDto,
    ) {
      return this.productService.update(+id, updateProductDto);
    }
  
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a product' })
    @ApiResponse({
      status: 200,
      description: 'The product has been successfully deleted.',
    })
    @ApiResponse({
      status: 404,
      description: 'Product not found.',
    })
    @ApiResponse({
      status: 403,
      description: 'Forbidden: Only admins can delete products.',
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
      return this.productService.delete(+id);
    }
  }
  