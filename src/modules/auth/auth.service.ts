import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/model/entity/user.entity';
import { CreateUserDto } from '../users/model/dto/create-user.dto';
import { Helpers } from 'src/common/utils/helpers';
import { LoginDto } from './model/dto/login.dto';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}
   
    async signUp(dto: CreateUserDto) {
        const hashedPassword = await Helpers.hashData(dto.password)
        const newUser = await this.usersService.createUser({
            ...dto,
            password: hashedPassword,
        })

        const tokens = await this.getTokens(newUser.id, newUser.email)
        
        await this.updateTokens(newUser.id, tokens.accessToken, tokens.refreshToken)

        return { tokens }
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

        const tokens = await this.getTokens(existingUser.id, existingUser.email)
        const user = await this.updateTokens(existingUser.id, tokens.accessToken, tokens.refreshToken)

        return { user, tokens }
    }

    async refreshToken(user: User) {
        if(!user || !user.refreshToken) {
            throw new ForbiddenException('Unauthorised access')
        }

        const { accessToken, refreshToken } = await this.getTokens(user.id, user.email)
        await this.updateTokens(user.id, accessToken, refreshToken)

        return { accessToken }
    }

    private async updateTokens(userId: string, accessToken: string, refreshToken: string): Promise<User> {
       return await this.usersService.updateUser(userId, { accessToken: accessToken, refreshToken: refreshToken })
    }

    private async getTokens(userId: string, email: string) {
        const [ accessToken, refreshToken ] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email,
                },
                {
                    secret: process.env.JWT_SECRET,
                    expiresIn: '3d'
                }
            ),

            this.jwtService.signAsync(
                {
                    sub: userId,
                    email,
                },
                {
                    secret: process.env.JWT_REFRESH_SECRET,
                    expiresIn: '7d',
                }
            )
        ])

        return { accessToken, refreshToken }
    } 

}
