import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import { loggerLink } from '@trpc/client/links/loggerLink';
import { createWSClient, wsLink } from '@trpc/client/links/wsLink';
import { createTRPCNext } from '@trpc/next';
import type { inferProcedureOutput } from '@trpc/server';
import { NextPageContext } from 'next';
import superjson from 'superjson';

import type { AppRouter } from '@/server/routers/_app';

function getEndingLink(ctx: NextPageContext | undefined) {
    if (typeof window === 'undefined') {
        return httpBatchLink({
            url: `${ process.env.APP_URL }/api/trpc`,
            headers() {
                if (!ctx?.req?.headers) {
                    return {};
                }
                // on ssr, forward client's headers to the server
                return {
                    ...ctx.req.headers,
                    'x-ssr': '1'
                };
            }
        });
    }

    const client = createWSClient({
        url: `${ location.protocol === 'https' ? 'wss' : 'ws' }://${ location.host }/api/trpc`
    });

    return wsLink<AppRouter>({
        client
    });
}

export const trpc = createTRPCNext<AppRouter>({
    config({ ctx }) {
        return {
            links: [
                loggerLink({
                    enabled: opts =>
                        (process.env.NODE_ENV === 'development' &&
                            typeof window !== 'undefined') ||
                        (opts.direction === 'down' && opts.result instanceof Error)
                }),
                getEndingLink(ctx)
            ],

            transformer: superjson,

            queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } }
        };
    },

    ssr: true
});

export type inferQueryOutput<
    TRouteKey extends keyof AppRouter['_def']['queries']
> = inferProcedureOutput<AppRouter['_def']['queries'][TRouteKey]>;
