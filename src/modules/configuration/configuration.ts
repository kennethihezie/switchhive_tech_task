import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";


@Injectable()
export class Configuration {
    constructor(private readonly service: ConfigService) { }

    env = {
        app: {
            name: this.service.get<string>('APP_NAME')
        },
        database: {
            type: 'postgres',
            host: this.service.get<string>('DB_HOST'),
            port: +this.service.get<string>('DB_PORT'),
            username: this.service.get<string>('DB_USER_NAME'),
            password: this.service.get<string>('DB_PASSWORD'),
            database: this.service.get<string>('DB_NAME'),
            autoLoadEntities: true,
            synchronize: false,
            migrations: ['dist/migrations/*{.ts,.js}'],
            cli: {
                migrationsDir: 'src/migrations',
            },
        } as TypeOrmModuleOptions,
        jwt: {
            jwtSecret: this.service.get<string>('JWT_SECRET'),
            jwtRefreshSecret: this.service.get<string>('JWT_REFRESH_SECRET')
        },
    }
}