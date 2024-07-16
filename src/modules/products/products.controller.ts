import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './model/dto/create-product.dto';
import { ResponseMessage } from '../../common/decorators/response_message.decorator';
import { AppMessages } from '../../common/constants/app_messages';
import { AccessTokenGuard } from '../auth/guard/access_token.guard';
import { UpdateProductDto } from './model/dto/update-product.dto';
import { CurrentUser } from '../../common/decorators/current_user.decorator';
import { User } from '../users/model/entity/user.entity';


@UseGuards(AccessTokenGuard)
@Controller('products')
export class ProductsController {
    constructor(private readonly service: ProductsService) {}

    @Post()
    @ResponseMessage(AppMessages.PRODUCT_CREATED)
    async createProduct(@Body() dto: CreateProductDto, @CurrentUser() user: User){
        return await this.service.createProduct({...dto, userId: user.id})
    }

    @Put('/:id')
    @ResponseMessage(AppMessages.PRODUCT_UPDATED)
    async updateProduct(@Body() dto: UpdateProductDto, @Param('id') id: string){
        return await this.service.updateProduct(id, dto)
    }

    @Get()
    @ResponseMessage(AppMessages.PRODUCTS_FETCHED)
    async getProducts(){
        return await this.service.getProducts()
    }

    @Get('/user-products')
    @ResponseMessage(AppMessages.PRODUCTS_FETCHED)
    async getUserProducts(@CurrentUser() user: User){
      return await this.service.getUserProducts(user.id)
    }

    @Get('/:id')
    @ResponseMessage(AppMessages.PRODUCT_FETCHED)
    async getProduct(@Param('id') id: string){
        return await this.service.getProduct(id)
    }

    @Delete('/:id')
    @ResponseMessage(AppMessages.PRODUCT_DELETED)
    async deleteProduct(@CurrentUser() user: User){
     return await this.service.deleteProduct(user.id)
    }
}
