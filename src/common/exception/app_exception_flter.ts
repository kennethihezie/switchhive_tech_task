import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import e, { Request, Response } from "express";
import { ResponseFormat } from "../utils/response_format";
import { QueryFailedError } from "typeorm/error/QueryFailedError";

/*
 The AppExceptionFilter class is used to handle all 
 errors or crash in the app globally.
 */

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
    catch(exception: Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const request = ctx.getRequest<Request>()
        const response = ctx.getResponse<Response>()

        if(exception instanceof HttpException) {
           ResponseFormat.handleErrorResponse(request, response, exception.getResponse(), exception.getStatus())
        } else if (exception.name === 'JsonWebTokenError' || exception.name === 'TokenExpiredError') {
            ResponseFormat.handleErrorResponse(request, response, exception.message, 400)
        } else if(exception.name === 'CastError') {
            ResponseFormat.handleErrorResponse(request, response, exception.message, 400)
        } else if (exception instanceof QueryFailedError) {
            const pgError = exception as QueryFailedError & { code: string };
            if (pgError.code === '23505') {
                ResponseFormat.handleErrorResponse(request, response, 'User already exits', 400)
            } else if (pgError.code === '23503') {
                ResponseFormat.handleErrorResponse(request, response, 'Foreign key constraint violated', 400)
            } else if (pgError.code === '23502') {
                ResponseFormat.handleErrorResponse(request, response, 'Not null constraint violated', 400)
            } else if (pgError.code === '23514') {
                ResponseFormat.handleErrorResponse(request, response, 'Check constraint violated', 400)
            } else if (pgError.code === '23P01') {
                ResponseFormat.handleErrorResponse(request, response, 'Exclusion constraint violated', 400)
            } else if (pgError.code === '22P02') {
                ResponseFormat.handleErrorResponse(request, response, 'Invalid text representation', 400)
            } else if (pgError.code === '22012') {
                ResponseFormat.handleErrorResponse(request, response, 'Division by zero', 400)
            } else if (pgError.code === '22001') {
                ResponseFormat.handleErrorResponse(request, response, 'String data right truncation', 400)
            } else if (pgError.code === '22003') {
                ResponseFormat.handleErrorResponse(request, response, 'Numeric value out of range', 400)
            }
          } else {
            ResponseFormat.handleErrorResponse(request, response, exception.message, 400)
        }
    }
}