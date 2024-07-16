import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Configuration } from './configuration';

@Module({
    imports: [ ConfigModule ],
    providers: [ ConfigService, Configuration ],
    exports: [ Configuration ]
})
export class ConfigurationModule {}
