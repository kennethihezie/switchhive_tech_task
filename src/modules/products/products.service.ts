import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './model/entity/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './model/dto/create-product.dto';
import { UpdateProductDto } from './model/dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(@InjectRepository(Product) private repository: Repository<Product>){}

    async createProduct(dto: CreateProductDto): Promise<Product> {
        const product = this.repository.create(dto)
        return await this.repository.save(product)
    }

    async updateProduct(id: string, dto: UpdateProductDto): Promise<Product> {
        const product = await this.getProduct(id)
        if(!product){
         throw new NotFoundException('Product not found')
        }
 
        //copies attrs to user
        Object.assign(product, dto)
 
        return await this.repository.save(product)
    }

    async getProduct(id: string): Promise<Product> {
        const product = await this.repository.findOneBy({ id })
        return product
    }

    async getUserProducts(userId: string): Promise<Product[]> {
        const products = await this.repository.findBy({ id: userId })
        return products
    }

    async getProducts(): Promise<Product[]> {
        const products = await this.repository.find()
        return products
    }

    async deleteProduct(id: string): Promise<Product> {
        const product = await this.getProduct(id)
        if(!product){
         throw new NotFoundException('Product not found')
        }

        return await this.repository.remove(product)
    }
}
