import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator"

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    description: string

    @IsNumber()
    @IsPositive()
    price: number

    @IsString()
    @IsNotEmpty()
    imageUrl: string

    userId: string
}