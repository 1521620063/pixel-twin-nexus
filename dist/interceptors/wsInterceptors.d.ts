import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
export interface WsResponse<T> {
    data: T;
    code: number;
    message: string;
    event?: string;
    timestamp?: number;
}
export declare class WsInterceptor<T> implements NestInterceptor<T, WsResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<WsResponse<T>>;
}
