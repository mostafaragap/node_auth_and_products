// import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// export const User = createParamDecorator(
//     (data: string | undefined, ctx: ExecutionContext) => {
//         const request = ctx.switchToHttp().getRequest();
//         const user = request.user;

//         // Return a specific field if specified, otherwise return the full user object
//         return data ? user?.[data] : user;
//     },
// );

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * @User() decorator retrieves `request.user` from the request,
 * or if a string `data` is provided, returns that specific user field.
 */
export const User = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;
        return data ? user?.[data] : user;
    },
);
