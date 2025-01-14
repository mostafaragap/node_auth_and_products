import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Inject,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
    constructor(@Inject('CACHE_MANAGER') private readonly cacheManager: Cache) { }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const key = this.generateCacheKey(request);

        // Check if the response is already cached
        const cachedResponse = await this.cacheManager.get(key);
        if (cachedResponse) {
            return of(cachedResponse); // Return cached data
        }

        // If not cached, proceed with the request and cache the response
        return next.handle().pipe(
            tap(async (response) => {
                await this.cacheManager.set(key, response, 15); // Cache for 5 minutes
            }),
        );
    }

    private generateCacheKey(request: any): string {
        const { method, originalUrl } = request;
        return `${method}:${originalUrl}`; // Use the method and URL as the cache key
    }
}
