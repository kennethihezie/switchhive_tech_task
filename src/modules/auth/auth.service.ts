import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/model/entity/user.entity';
import { CreateUserDto } from '../users/model/dto/create-user.dto';
import { Helpers } from '../../common/utils/helpers';
import { LoginDto } from './model/dto/login.dto';
import { Configuration } from '../configuration/configuration';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService, private config: Configuration) {}
   
    async signUp(dto: CreateUserDto) {
        const hashedPassword = await Helpers.hashData(dto.password)
        const newUser = await this.usersService.createUser({
            ...dto,
            password: hashedPassword,
        })

        const { accessToken, refreshToken} = await this.updateTokens(newUser)

        return { tokens: { accessToken, refreshToken } }
    }


    async login(loginDto: LoginDto) {
        const { email, password } = loginDto
        const existingUser = await this.usersService.getUserByEmail(email)

        if(!existingUser){
            throw new NotFoundException('User does not exist.')
        }

        const matchPassword = await Helpers.verifyData(existingUser.password, password)
        if(!matchPassword){
            throw new BadRequestException('Password is incorrect')
        }

        const { user, accessToken, refreshToken} = await this.updateTokens(existingUser)

        return { user, tokens: { accessToken, refreshToken } }
    }

    async refreshToken(user: User) {
        if(!user || !user.refreshToken) {
            throw new ForbiddenException('Unauthorised access')
        }

        const { accessToken } = await this.updateTokens(user)

        return { accessToken }
    }



    async updateTokens(data: User) {
        const [ accessToken, refreshToken ] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: data.id,
                    email: data.email,
                },
                {
                    secret: this.config.env.jwt.jwtSecret,
                    expiresIn: '1d'
                }
            ),

            this.jwtService.signAsync(
                {
                    sub: data.id,
                    email: data.email,
                },
                {
                    secret: this.config.env.jwt.jwtRefreshSecret,
                    expiresIn: '7d',
                }
            )
        ])

        const user = await this.usersService.updateUser(data.id, { accessToken, refreshToken })

        return { user, accessToken, refreshToken }
    }
}
