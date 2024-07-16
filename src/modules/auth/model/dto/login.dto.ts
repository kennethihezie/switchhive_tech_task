import { IsEmail, IsNotEmpty, IsString } from "class-validator";


// The LoginDto is used to validate incoming email and password payload on login route.
export class LoginDto {
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string
}