'use client';

import { ReactNode } from 'react';

import { trpc } from '@/utils/trpc';

const TrpcProvider = trpc.withTRPC(
    (props: { children: ReactNode }) => props.children
) as React.ComponentType<React.PropsWithChildren>;

export function ClientProviders(props: { children: ReactNode }) {
    return (
        <TrpcProvider>
            { props.children }
        </TrpcProvider>
    );
}
