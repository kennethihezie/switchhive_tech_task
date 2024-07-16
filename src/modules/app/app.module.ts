import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_PIPE, APP_INTERCEPTOR } from '@nestjs/core';
import { AppExceptionFilter } from 'src/common/exception/app_exception_flter';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigurationModule } from '../configuration/configuration.module';
import { Configuration } from '../configuration/configuration';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ConfigurationModule,

    TypeOrmModule.forRootAsync({
      imports: [ ConfigurationModule ],
      inject: [ Configuration ],
      useFactory: (config: Configuration) => {      
        return config.env.database
      }
    }), 

    AuthModule,
    UsersModule,
    ProductsModule
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter
    },

    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: false, transform: true })
    },

    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor
    }, 
  ],
})
export class AppModule {}
