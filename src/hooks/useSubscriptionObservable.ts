import { UseTRPCSubscriptionOptions } from '@trpc/react-query/shared';
import { useMemo, useState } from 'react';
import { Observable, Subject } from 'rxjs';

export const useSubscriptionObservable = <TInput, TOutput, TError>(
    {
        useSubscription
    }: {
        useSubscription: (
            input: TInput,
            opts?: UseTRPCSubscriptionOptions<TOutput, TError>,
        ) => void
    },
    input: TInput,
    {
        enabled
    }: {
        enabled?: boolean
    } = {}
): [Observable<TOutput>, { active: boolean }] => {
    const [ active, setActive ] = useState(false);
    const subject = useMemo(() => new Subject<TOutput>(), []);

    useSubscription(input, {
        enabled,
        onStarted: () => setActive(true),
        onData: value => subject.next(value),
        onError: error => {
            subject.error(error);
            setActive(false);
        }
    });

    return [ subject, { active } ];
};
