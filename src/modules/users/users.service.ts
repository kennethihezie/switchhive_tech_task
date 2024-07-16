import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './model/entity/user.entity';
import { CreateUserDto } from './model/dto/create-user.dto';
import { UpdateUserDto } from './model/dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repository: Repository<User>){}

    async createUser(dto: CreateUserDto): Promise<User> {
       const user = this.repository.create(dto)
       return await this.repository.save(user)
    }

    async getUser(id: string): Promise<User> {
        const user = await this.repository.findOneBy({ id })
        return user
    }

    async findUserWithProducts(userId: string): Promise<User> {
        return this.repository.findOne({
            where: { id: userId },
            relations: ['products'],
        });
    }

    async getUserByEmail(email: string): Promise<User> {
        return await this.repository.findOne({ where: { email }})
    }

    async updateUser(id: string, dto: UpdateUserDto): Promise<User> {
        const user = await this.getUser(id)
        if(!user){
         throw new NotFoundException('User not found')
        }
 
        Object.assign(user, dto)
 
        return await this.repository.save(user)
     }
}
