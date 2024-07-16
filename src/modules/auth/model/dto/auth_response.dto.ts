import { Expose, Type } from "class-transformer";
import { TokensDto } from "./token.dto";
import { UserResponseDto } from "../../../users/model/dto/user-response.dto";


// The AuthResponseDto exposes user-related fields in outgoing responses.
export class AuthResponseDto {
    @Expose()
    @Type(() => UserResponseDto)
    user: UserResponseDto

    @Expose()
    @Type(() => TokensDto)
    tokens?: TokensDto
}