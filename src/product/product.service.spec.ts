import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { ProductRepository } from './repository/product.repository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { NotFoundException } from '@nestjs/common';

describe('ProductService', () => {
  let service: ProductService;
  let repository: ProductRepository;
  let cacheManager: any;

  const mockRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockCacheManager = {
    store: {
      getClient: jest.fn(() => ({
        keys: jest.fn(),
        del: jest.fn(),
      })),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: ProductRepository, useValue: mockRepository },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<ProductRepository>(ProductRepository);
    cacheManager = module.get(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product and invalidate cache', async () => {
      let createdAt = new Date();
      let updatedAt = new Date();

      const createProductDto = {
        name: 'Product 1',
        price: 1000,
        description: 'A test product',
        stock: 10,
        createdAt,
        updatedAt
      }; // Include all required properties

      const mockProduct = { id: 1, ...createProductDto };
      const redisClient = cacheManager.store.getClient();
      redisClient.keys.mockResolvedValue(['GET:/products?page=1&limit=10']);
      redisClient.del.mockResolvedValue(1);

      mockRepository.create.mockResolvedValue(mockProduct);

      const result = await service.create(createProductDto);

      expect(repository.create).toHaveBeenCalledWith(createProductDto);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('findAll', () => {
    it('should return paginated products with metadata', async () => {
      const mockProducts = [{ id: 1, name: 'Product 1', price: 1000 }];
      const total = 1;
      const page = 1;
      const limit = 10;

      mockRepository.findAll.mockResolvedValue({ products: mockProducts, total });

      const result = await service.findAll(page, limit);

      expect(repository.findAll).toHaveBeenCalledWith(page, limit);
      expect(result).toEqual({
        data: mockProducts,
        meta: {
          totalItems: total,
          itemCount: mockProducts.length,
          itemsPerPage: limit,
          totalPages: 1,
          currentPage: page,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a product if it exists', async () => {
      const mockProduct = { id: 1, name: 'Product 1', price: 1000 };

      mockRepository.findById.mockResolvedValue(mockProduct);

      const result = await service.findOne(1);

      expect(repository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException if product does not exist', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(repository.findById).toHaveBeenCalledWith(999);
    });
  });

  describe('update', () => {
    it('should update a product and invalidate cache', async () => {
      const mockProduct = { id: 1, name: 'Updated Product', price: 1500 };
      const updateProductDto = { name: 'Updated Product', price: 1500 };
      const redisClient = cacheManager.store.getClient();
      redisClient.keys.mockResolvedValue(['GET:/products?page=1&limit=10']);
      redisClient.del.mockResolvedValue(1);

      mockRepository.findById.mockResolvedValue(mockProduct);
      mockRepository.update.mockResolvedValue(mockProduct);

      const result = await service.update(1, updateProductDto);
      expect(repository.update).toHaveBeenCalledWith(1, updateProductDto);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('delete', () => {
    it('should delete a product and invalidate cache', async () => {
      const mockProduct = { id: 1, name: 'Product 1', price: 1000 };
      const redisClient = cacheManager.store.getClient();
      redisClient.keys.mockResolvedValue(['GET:/products?page=1&limit=10']);
      redisClient.del.mockResolvedValue(1);

      mockRepository.findById.mockResolvedValue(mockProduct);
      mockRepository.delete.mockResolvedValue(mockProduct);

      const result = await service.delete(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException if product does not exist', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.delete(999)).rejects.toThrow(NotFoundException);
      expect(repository.findById).toHaveBeenCalledWith(999);
    });
  });
});
