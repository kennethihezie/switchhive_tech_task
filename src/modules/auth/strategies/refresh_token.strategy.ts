import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Configuration } from "src/modules/configuration/configuration";
import { UsersService } from "src/modules/users/users.service";

// Defines a Strategy for RefreshTokenStrategy

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(private readonly usersService: UsersService, private readonly config: Configuration) {        
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.env.jwt.jwtRefreshSecret,
            passReqToCallback: true
        })
    }

    async validate(req: Request, payload: any) {
        const { sub } = payload
        const user = await this.usersService.getUser(sub)

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const refreshToken = req.get('Authorization').replace('Bearer', '').trim()
        
        if (refreshToken !== user.refreshToken) {
            throw new UnauthorizedException('Invalid or expired token');
        }
          

        return user
    }
}