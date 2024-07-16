import { Expose } from "class-transformer"

// The TokensDto exposes user-related fields in outgoing responses.
export class TokensDto {
    @Expose()
    accessToken: string

    @Expose()
    refreshToken: string
}
