import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { UsersService } from "src/modules/users/users.service"
import { Request } from "express";
import { Configuration } from "src/modules/configuration/configuration";

type JwtPayload = {
    sub: string
    email: string
}

// Defines a Strategy for AccessTokenStrategy
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly usersService: UsersService, private readonly config: Configuration) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.env.jwt.jwtSecret,
            passReqToCallback: true
        })
    }

    async validate(req: Request, payload: JwtPayload) {
        const { sub } = payload
                
        const user = await this.usersService.getUser(sub)

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const token = req.get('Authorization').replace('Bearer', '').trim()

        if (user.accessToken !== token) {
            throw new UnauthorizedException('Invalid or expired token');
        }
          
        return user
    }
}