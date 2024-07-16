import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common"
import { Observable, map } from "rxjs"
import { Reflector } from '@nestjs/core';
import { ResponseFormat } from "../utils/response_format";


export interface AppResponse<T> {
    statusCode: number
    status: string
    message: string
    data: T
}

/*
Handles all outgoing responses and formats the data.
*/
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, AppResponse<T>> {
    constructor(private reflector: Reflector) {}

    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<AppResponse<T>> | Promise<Observable<AppResponse<T>>> {
        return next.handle().pipe(map((data: T) => ResponseFormat.handleSuccesResponse<T>(context, this.reflector, data)))
    }
}