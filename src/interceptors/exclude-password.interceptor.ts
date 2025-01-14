import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ExcludePasswordInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data) => {
                // If the response is an array of users
                if (Array.isArray(data)) {
                    return data.map((item) => this.excludePassword(item));
                }
                // If the response is a single user
                return this.excludePassword(data);
            }),
        );
    }

    private excludePassword(data: any) {
        if (!data || typeof data !== 'object') {
            return data; // Return unchanged if data is not an object
        }
        const { password, ...rest } = data;
        return rest;
    }
}
