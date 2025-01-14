import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Product, Prisma } from '@prisma/client';

@Injectable()
export class ProductRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: Prisma.ProductCreateInput): Promise<Product> {
        return this.prisma.product.create({ data });
    }

    async findAll(page: number, limit: number) {
        const skip = (page - 1) * limit;
        const products = await this.prisma.product.findMany({
            skip,
            take: limit,
        });

        const total = await this.prisma.product.count();

        return { products, total };
    }

    async findById(id: number): Promise<Product | null> {
        return this.prisma.product.findUnique({ where: { id } });
    }

    async update(id: number, data: Prisma.ProductUpdateInput): Promise<Product> {
        return this.prisma.product.update({ where: { id }, data });
    }

    async delete(id: number): Promise<Product> {
        return this.prisma.product.delete({ where: { id } });
    }
}
