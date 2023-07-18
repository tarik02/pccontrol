import { Observable, Subject, combineLatest, merge } from 'rxjs';
import { distinctUntilChanged, filter, map, mergeMap, repeat, retry, share, shareReplay, startWith, tap, timeout } from 'rxjs/operators';
import { webSocket } from 'rxjs/webSocket';
import z from 'zod';

import { StatusSchema } from '@/common/schema';

const createSocket = () => {
    const openObserver = new Subject<Event>();
    const closeObserver = new Subject<CloseEvent>();
    const closingObserver = new Subject<void>();

    const socket$ = webSocket({
        url: process.env.PC_WS_URL!,
        openObserver,
        closeObserver,
        closingObserver
    });

    const messages$ = socket$.pipe(
        timeout({ each: 2000 }),
        retry({ delay: 500 }),
        repeat({ delay: 500 }),
        share()
    );

    const status$ = messages$.pipe(
        filter((message: any) => message.type === 'status'),
        map((message: any) => StatusSchema.parse(message.payload)),
        shareReplay(1)
    );

    const subscription = status$.subscribe();

    return {
        socket$,
        status$,
        onOpen$: openObserver,
        onClose$: closeObserver,
        onClosing$: closingObserver,
        isOpen$: merge(
            openObserver.pipe(map(() => true)),
            messages$.pipe(map(() => true)),
            closeObserver.pipe(map(() => false))
        ).pipe(distinctUntilChanged()).pipe(shareReplay(1)),
        close: () => {
            subscription.unsubscribe();
        }
    };
};

export const createSocketObservable = () => new Observable<Omit<ReturnType<typeof createSocket>, 'close'>>(subscriber => {
    const { close, ...socket } = createSocket();

    subscriber.next(socket);

    return close;
});

export const socket$ = createSocketObservable().pipe(shareReplay(1));

export type State = { isOpen: boolean, status: z.TypeOf<typeof StatusSchema> | null };

export const state$ = combineLatest([
    socket$.pipe(mergeMap(socket => socket.isOpen$)).pipe(startWith(false)),
    socket$.pipe(mergeMap(socket => socket.status$)).pipe(startWith(null))
]).pipe(
    map(([ isOpen, status ]) => ({
        isOpen,
        status
    })),
    shareReplay(1)
);

if (process.env.NODE_ENV === 'production') {
    state$.subscribe();
}
