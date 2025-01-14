import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from './repository/product.repository';
import { CreateProductDto, UpdateProductDto } from './dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductService {
    constructor(private readonly productRepository: ProductRepository,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    ) { }

    async deleteMatchingKeys(pattern: string): Promise<void> {
        const redisClient = (this.cacheManager as any).store.getClient();
        const keys = await redisClient.keys(pattern);

        if (keys.length > 0) {
            await redisClient.del(keys);
        }
    }

    async create(createProductDto: CreateProductDto) {
        // await this.cacheManager.del('GET:/products*');
        await this.deleteMatchingKeys('GET:/products*');

        return this.productRepository.create(createProductDto);
    }

    async findAll(page: number, limit: number) {
        const { products, total } = await this.productRepository.findAll(page, limit);
        return {
            data: products,
            meta: {
                totalItems: total,
                itemCount: products.length,
                itemsPerPage: limit,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
            },
        };
    }

    async findOne(id: number) {
        const product = await this.productRepository.findById(id);
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        return product;
    }

    async update(id: number, updateProductDto: UpdateProductDto) {
        await this.findOne(id); // Ensure product exists
        // Invalidate cache for 'findAll' and 'findOne'
        await this.deleteMatchingKeys('GET:/products*');
        return this.productRepository.update(id, updateProductDto);
    }

    async delete(id: number) {
        await this.findOne(id); // Ensure product exists
        await this.deleteMatchingKeys('GET:/products*');
        return this.productRepository.delete(id);
    }
}
