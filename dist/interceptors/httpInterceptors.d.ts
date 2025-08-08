import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
interface EncryptedResponse {
    pixel_twin_params: (string | null)[];
}
export interface Response<T> {
    data: T;
    code: number;
    message: string;
}
export declare class TransformInterceptor<T> implements NestInterceptor<T, Response<EncryptedResponse>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<EncryptedResponse>>;
}
export {};
