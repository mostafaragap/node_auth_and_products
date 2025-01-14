import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from './repository/product.repository';
import { CreateProductDto, UpdateProductDto } from './dto';


@Injectable()
export class ProductService {
    constructor(private readonly productRepository: ProductRepository) { }

    async create(createProductDto: CreateProductDto) {
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
        return this.productRepository.update(id, updateProductDto);
    }

    async delete(id: number) {
        await this.findOne(id); // Ensure product exists
        return this.productRepository.delete(id);
    }
}
