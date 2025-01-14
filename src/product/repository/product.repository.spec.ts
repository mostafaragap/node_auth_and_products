import { Test, TestingModule } from '@nestjs/testing';
import { ProductRepository } from './product.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { Product } from '@prisma/client';

describe('ProductRepository', () => {
    let repository: ProductRepository;
    let prisma: PrismaService;

    const mockPrismaService = {
        product: {
            create: jest.fn(),
            findMany: jest.fn(),
            count: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductRepository,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        repository = module.get<ProductRepository>(ProductRepository);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });

    describe('create', () => {
        it('should create a product', async () => {
            const mockProduct = { id: 1, name: 'Laptop', price: 1000, description: "A high-performance laptop", stock: 100 } as Product;
            const mockInput = { name: 'Laptop', price: 1000, description: "A high-performance laptop", stock: 100 };

            mockPrismaService.product.create.mockResolvedValue(mockProduct);

            const result = await repository.create(mockInput);
            expect(result).toEqual(mockProduct);
            expect(prisma.product.create).toHaveBeenCalledWith({ data: mockInput });
        });
    });

    describe('findAll', () => {
        it('should return paginated products with total count', async () => {
            const mockProducts = [
                { id: 1, name: 'Laptop 1', price: 1000 },
                { id: 2, name: 'Laptop 2', price: 2000 },
            ] as Product[];
            const mockTotal = 10;

            mockPrismaService.product.findMany.mockResolvedValue(mockProducts);
            mockPrismaService.product.count.mockResolvedValue(mockTotal);

            const page = 1;
            const limit = 2;
            const result = await repository.findAll(page, limit);

            expect(result).toEqual({ products: mockProducts, total: mockTotal });
            expect(prisma.product.findMany).toHaveBeenCalledWith({
                skip: 0,
                take: limit,
            });
            expect(prisma.product.count).toHaveBeenCalled();
        });
    });

    describe('findById', () => {
        it('should return a product by ID', async () => {
            const mockProduct = { id: 1, name: 'Laptop', price: 1000 } as Product;

            mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);

            const result = await repository.findById(1);
            expect(result).toEqual(mockProduct);
            expect(prisma.product.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        it('should return null if product not found', async () => {
            mockPrismaService.product.findUnique.mockResolvedValue(null);

            const result = await repository.findById(999);
            expect(result).toBeNull();
            expect(prisma.product.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
        });
    });

    describe('update', () => {
        it('should update a product by ID', async () => {
            const mockUpdatedProduct = { id: 1, name: 'Updated Laptop', price: 1200 } as Product;
            const mockUpdateInput = { name: 'Updated Laptop', price: 1200 };

            mockPrismaService.product.update.mockResolvedValue(mockUpdatedProduct);

            const result = await repository.update(1, mockUpdateInput);
            expect(result).toEqual(mockUpdatedProduct);
            expect(prisma.product.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: mockUpdateInput,
            });
        });
    });

    describe('delete', () => {
        it('should delete a product by ID', async () => {
            const mockDeletedProduct = { id: 1, name: 'Laptop', price: 1000 } as Product;

            mockPrismaService.product.delete.mockResolvedValue(mockDeletedProduct);

            const result = await repository.delete(1);
            expect(result).toEqual(mockDeletedProduct);
            expect(prisma.product.delete).toHaveBeenCalledWith({ where: { id: 1 } });
        });
    });
});
