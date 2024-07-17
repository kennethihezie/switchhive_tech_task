import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { UserResponseDto } from './model/dto/user-response.dto';


@Serialize(UserResponseDto)
@Controller('users')
export class UsersController {
    constructor(private readonly service: UsersService) {}
}
