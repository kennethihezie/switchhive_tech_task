import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { User } from "src/modules/users/model/entity/user.entity";

@Injectable()
export class Configuration {
    constructor(private readonly service: ConfigService) { }

    env = {
        app: {
            name: this.service.get<string>('APP_NAME')
        },
        database: {
            type: 'sqlite',
            database: this.service.get<string>('DB_NAME'),
            entities: [ User ],
            synchronize: true,
        }
    }
}