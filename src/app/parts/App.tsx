'use client';

import { useObservable } from 'rxjs-hooks';

import { useSubscriptionObservable } from '@/hooks/useSubscriptionObservable';
import { State } from '@/server/status/pccontrol';
import { trpc } from '@/utils/trpc';

import { Header } from './Header';
import { ModePart } from './ModePart';
import { RgbModePart } from './RgbModePart';

type Props = {
    initialState: State
};

export const App = (props: Props) => {
    const [ state$, { active } ] = useSubscriptionObservable(trpc.state$, undefined);
    const state = useObservable(() => state$, props.initialState);

    return (
        <>
            <Header
                state={ state }
                disabled={ !active }
            />

            <main
                className="grow flex flex-row justify-center"
            >
                <div className="max-w-[600px] grow bg-black shadow-[0_35px_60px_-15px_rgba(255,255,255,0.3)]">
                    <div className="px-5">
                        <ModePart
                            className="mt-2"
                            value={ state?.status?.mode }
                            disabled={ !state?.isOpen || state.status === null || !active }
                        />

                        <RgbModePart
                            className="mt-5"
                            value={ state?.status?.rgb_mode }
                            disabled={ !state?.isOpen || state.status === null || !active }
                        />
                    </div>
                </div>
            </main>
        </>
    );
};
