import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductRepository } from './repository/product.repository';

@Module({
  imports: [PrismaModule],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
})
export class ProductModule { }
