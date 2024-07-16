import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/model/dto/create-user.dto';
import { ResponseMessage } from 'src/common/decorators/response_message.decorator';
import { AppMessages } from 'src/common/constants/app_messages';
import { LoginDto } from './model/dto/login.dto';
import { CurrentUser } from 'src/common/decorators/current_user.decorator';
import { User } from '../users/model/entity/user.entity';
import { RefreshTokenGuard } from './guard/refresh_token.guard';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { AuthResponseDto } from './model/dto/auth_response.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly service: AuthService) {}

    @Post('/signup')
    @ResponseMessage(AppMessages.USER_CREATED)
    async signUp(@Body() dto: CreateUserDto) {
        return await this.service.signUp(dto)
    }

    @Serialize(AuthResponseDto)
    @Post('/login')
    @ResponseMessage(AppMessages.USERS_LOGIN)
    async login(@Body() dto: LoginDto) {
        return await this.service.login(dto)
    }

    @UseGuards(RefreshTokenGuard)
    @Get('/refresh-token')
    @ResponseMessage(AppMessages.TOKEN_REFRESHED)
    async refreshToken(@CurrentUser() user: User){
        return await this.service.refreshToken(user)
    }
}
