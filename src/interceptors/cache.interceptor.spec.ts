import { Test, TestingModule } from '@nestjs/testing';
import { CacheInterceptor } from './cache.interceptor';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { lastValueFrom } from 'rxjs';

describe('CacheInterceptor', () => {
    let interceptor: CacheInterceptor;
    let cacheManager: any;

    const mockCacheManager = {
        get: jest.fn(),
        set: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CacheInterceptor,
                { provide: CACHE_MANAGER, useValue: mockCacheManager },
            ],
        }).compile();

        interceptor = module.get<CacheInterceptor>(CacheInterceptor);
        cacheManager = module.get(CACHE_MANAGER);
    });

    it('should return cached data if available', async () => {
        const mockRequest = { method: 'GET', originalUrl: '/products' };
        const mockContext = { switchToHttp: () => ({ getRequest: () => mockRequest }) };
        const mockNext = { handle: jest.fn() };
        const cachedResponse = [{ id: 1, name: 'Product 1' }];

        mockCacheManager.get.mockResolvedValue(cachedResponse);

        // intercept(...) returns an Observable
        const result$ = await interceptor.intercept(mockContext as any, mockNext as any);
        // Convert Observable -> Promise
        const result = await lastValueFrom(result$);

        expect(result).toEqual(cachedResponse);
        expect(cacheManager.get).toHaveBeenCalledWith('GET:/products');
    });
});
