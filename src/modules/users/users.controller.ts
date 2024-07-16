import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ResponseMessage } from 'src/common/decorators/response_message.decorator';
import { AppMessages } from 'src/common/constants/app_messages';
import { CreateUserDto } from './model/dto/create-user.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { UserResponseDto } from './model/dto/user-response.dto';
import { AccessTokenGuard } from '../auth/guard/access_token.guard';
import { CurrentUser } from 'src/common/decorators/current_user.decorator';
import { User } from './model/entity/user.entity';


@Serialize(UserResponseDto)
@Controller('users')
export class UsersController {
    constructor(private readonly service: UsersService) {}

    @Post()
    @ResponseMessage(AppMessages.USER_CREATED)
    async createUser(@Body() dto: CreateUserDto) {
        return await this.service.createUser(dto)
    }

    @UseGuards(AccessTokenGuard)
    @ResponseMessage(AppMessages.PRODUCTS_FETCHED)
    @Get('/products')
    async findUserWithProducts(@CurrentUser() user: User) {
        return await this.service.findUserWithProducts(user.id)
    }
}
