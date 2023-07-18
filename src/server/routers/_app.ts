import { Observable } from '@trpc/server/observable';
import {execaCommand } from 'execa';
import { filter, firstValueFrom, timeout } from 'rxjs';
import z from 'zod';

import { ModeSchema, RgbModeSchema } from '@/common/schema';

import { State, socket$, state$ } from '../status/pccontrol';
import { publicProcedure, router } from '../trpc';

let idCounter = 0;
const nextId = () => idCounter = (idCounter + 1) % 100000;

export const appRouter = router({
    setStatus: publicProcedure
        .input(z.boolean())
        .mutation(async ({ input }) => {
            try {
                if (input === false) {
                    const socket = await firstValueFrom(socket$.pipe(timeout(1000)));

                    const id = nextId();

                    socket.socket$.next({ id, type: 'set_rgb_mode', payload: { name: 'off' } });

                    await firstValueFrom(
                        socket.socket$
                            .pipe(filter((message: any) => message.id === id))
                            .pipe(timeout(1000))
                    );
                }
            } catch (e) {
                // eslint-disable-next-line no-console
                console.error(e);
            }

            await Promise.all([
                execaCommand(
                    input
                        ? process.env.WOL_COMMAND_ON!
                        : process.env.WOL_COMMAND_OFF!,
                    {
                        stdio: 'inherit'
                    }
                ),

                firstValueFrom(socket$.pipe(timeout(10000))).then(
                    socket => firstValueFrom(
                        socket.isOpen$.pipe(
                            filter(value => value === input)
                        )
                    )
                )
            ]);

            try {
                if (input === true) {
                    const socket = await firstValueFrom(socket$.pipe(timeout(1000)));

                    const id = nextId();

                    socket.socket$.next({ id, type: 'set_rgb_mode', payload: { name: 'default' } });

                    await firstValueFrom(
                        socket.socket$
                            .pipe(filter((message: any) => message.id === id))
                            .pipe(timeout(1000))
                    );
                }
            } catch (e) {
                // eslint-disable-next-line no-console
                console.error(e);
            }
        }),

    setMode: publicProcedure
        .input(z.object({
            mode: ModeSchema
        }))
        .mutation(async ({ input: { mode } }) => {
            const socket = await firstValueFrom(socket$);

            const id = nextId();

            socket.socket$.next({ id, type: 'set_mode', payload: mode });

            await firstValueFrom(
                socket.socket$
                    .pipe(filter((message: any) => message.id === id))
                    .pipe(timeout(1000))
            );
        }),

    setRgbMode: publicProcedure
        .input(z.object({
            mode: RgbModeSchema
        }))
        .mutation(async ({ input: { mode } }) => {
            const socket = await firstValueFrom(socket$);

            const id = nextId();

            socket.socket$.next({ id, type: 'set_rgb_mode', payload: mode });

            await firstValueFrom(
                socket.socket$
                    .pipe(filter((message: any) => message.id === id))
                    .pipe(timeout(1000))
            );
        }),

    state$: publicProcedure.subscription(() => {
        return state$ as Observable<State, any>;
    })
});

export type AppRouter = typeof appRouter;
