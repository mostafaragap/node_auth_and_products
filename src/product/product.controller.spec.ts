import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CreateProductDto, PaginationDto, UpdateProductDto } from './dto';
import { RolesGuard } from '../guards/roles.guard';
import { JwtAuthGuard } from '../guards/auth.guard';
// import { CacheInterceptor } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { CacheInterceptor } from 'src/interceptors/cache.interceptor';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  const mockProductService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        { provide: ProductService, useValue: mockProductService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideInterceptor(CacheInterceptor)
      .useValue({
        intercept: (context: ExecutionContext, next: any) => next.handle(),
      })
      .compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Product 1',
        price: 1000,
        description: 'A test product',
        stock: 10,
      };
      const mockProduct = { id: 1, ...createProductDto };

      mockProductService.create.mockResolvedValue(mockProduct);

      const result = await controller.create(createProductDto);

      expect(service.create).toHaveBeenCalledWith(createProductDto);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('findAll', () => {
    it('should return paginated products', async () => {
      const paginationDto: PaginationDto = { page: 1, limit: 10 };
      const mockResponse = {
        data: [{ id: 1, name: 'Product 1' }],
        meta: {
          totalItems: 1,
          itemCount: 1,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1,
        },
      };

      mockProductService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll(paginationDto);

      expect(service.findAll).toHaveBeenCalledWith(
        +paginationDto.page,
        +paginationDto.limit,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('findOne', () => {
    it('should return a product by ID', async () => {
      const mockProduct = { id: 1, name: 'Product 1' };

      mockProductService.findOne.mockResolvedValue(mockProduct);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException if product not found', async () => {
      mockProductService.findOne.mockRejectedValue(new Error('Product not found'));

      await expect(controller.findOne(999)).rejects.toThrow('Product not found');
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        price: 1500,
        description: 'Updated description',
        stock: 20,
      };
      const mockUpdatedProduct = { id: 1, ...updateProductDto };

      mockProductService.update.mockResolvedValue(mockUpdatedProduct);

      const result = await controller.update(1, updateProductDto);

      expect(service.update).toHaveBeenCalledWith(1, updateProductDto);
      expect(result).toEqual(mockUpdatedProduct);
    });
  });

  describe('delete', () => {
    it('should delete a product by ID', async () => {
      const mockDeletedProduct = { id: 1, name: 'Product 1' };

      mockProductService.delete.mockResolvedValue(mockDeletedProduct);

      const result = await controller.delete(1);

      expect(service.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockDeletedProduct);
    });
  });
});
