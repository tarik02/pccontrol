import { twMerge } from 'tailwind-merge';

import { Button } from '@/components/Button';
import { State } from '@/server/status/pccontrol';
import { trpc } from '@/utils/trpc';

type Props = {
    state: State,
    disabled?: boolean
};

export const Header = (props: Props) => {
    const {
        state,
        disabled = false
    } = props;

    const setStatusMutation = trpc.setStatus.useMutation();

    return (
        <header
            className={ twMerge(
                'flex flex-row justify-center',
                (state === null || disabled) && 'pointer-events-none'
            ) }
        >
            <div className="max-w-[600px] grow bg-black shadow-[0_35px_60px_-15px_rgba(255,255,255,0.3)]">
                <div className="p-5 flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                        <div className={ twMerge('flex gap-3 items-center', (!state?.isOpen || disabled) && 'opacity-50') }>
                            {
                                state === null
                                    ? <span className="w-[60px] h-[40px] flex items-center justify-center bg-gray-600 rounded-[10px]" />
                                    : state.isOpen
                                        ? <span className="w-[60px] h-[40px] flex items-center justify-center bg-green-600 rounded-[10px]">ON</span>
                                        : <span className="w-[60px] h-[40px] flex items-center justify-center bg-red-600 rounded-[10px]">OFF</span>
                            }
                        </div>

                        { state?.status && (
                            <div className={ twMerge('grow flex flex-col justify-center gap-1', (!state?.isOpen || disabled) && 'opacity-50') }>
                                <div className="leading-4 text-sm">{ `CPU: ${ state.status?.stats.temps.cpu.toFixed(0) }°C ` }</div>
                                <div className="leading-4 text-sm">{ `GPU: ${ state.status?.stats.temps.gpu.toFixed(0) }°C` }</div>
                            </div>
                        ) }
                    </div>

                    <div className="flex gap-3">
                        <Button
                            className="bg-red-500 hover:bg-red-700"
                            disabled={ (setStatusMutation.isLoading && setStatusMutation.variables !== false) || state?.isOpen !== true || disabled }
                            loading={ setStatusMutation.isLoading && setStatusMutation.variables === false }
                            onClick={ () => setStatusMutation.mutate(false) }
                        >
                            Sleep
                        </Button>
                        <Button
                            className="bg-blue-500 hover:bg-blue-700"
                            disabled={ (setStatusMutation.isLoading && setStatusMutation.variables !== true) || state?.isOpen !== false || disabled }
                            loading={ setStatusMutation.isLoading && setStatusMutation.variables === true }
                            onClick={ () => setStatusMutation.mutate(true) }
                        >
                            Wake
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
};
