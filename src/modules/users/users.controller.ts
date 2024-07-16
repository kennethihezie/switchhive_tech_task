import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { ResponseMessage } from '../../common/decorators/response_message.decorator';
import { AppMessages } from '../../common/constants/app_messages';
import { CreateUserDto } from './model/dto/create-user.dto';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { UserResponseDto } from './model/dto/user-response.dto';


@Serialize(UserResponseDto)
@Controller('users')
export class UsersController {
    constructor(private readonly service: UsersService) {}

    @Post()
    @ResponseMessage(AppMessages.USER_CREATED)
    async createUser(@Body() dto: CreateUserDto) {
        return await this.service.createUser(dto)
    }
}
