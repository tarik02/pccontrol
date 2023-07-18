import { twMerge } from 'tailwind-merge';
import z from 'zod';

import { ModeSchema } from '@/common/schema';
import { ModeButton } from '@/components/ModeButton';
import { trpc } from '@/utils/trpc';

export const ModePart = ({
    className,
    disabled,
    value = null
}: {
    className?: string,
    disabled?: boolean,
    value?: z.TypeOf<typeof ModeSchema> | null
}) => {
    const setModeMutation = trpc.setMode.useMutation();

    return (
        <div className={ twMerge('flex gap-3', className) }>
            <ModeButton
                className="flex-[20%]"
                disabled={ disabled }
                active={ value?.name === 'silent' }
                loading={ setModeMutation.isLoading && setModeMutation.variables?.mode.name === 'silent' }
                onClick={ () => setModeMutation.mutate({ mode: { name: 'silent' } }) }
            >Silent</ModeButton>
            <ModeButton
                className="flex-[20%]"
                disabled={ disabled }
                active={ value?.name === 'idle' }
                loading={ setModeMutation.isLoading && setModeMutation.variables?.mode.name === 'idle' }
                onClick={ () => setModeMutation.mutate({ mode: { name: 'idle' } }) }
            >Idle</ModeButton>
            <ModeButton
                className="flex-[20%]"
                disabled={ disabled }
                active={ value?.name === 'semi' }
                loading={ setModeMutation.isLoading && setModeMutation.variables?.mode.name === 'semi' }
                onClick={ () => setModeMutation.mutate({ mode: { name: 'semi' } }) }
            >Semi</ModeButton>
            <ModeButton
                className="flex-[20%]"
                disabled={ disabled }
                active={ value?.name === 'semi2' }
                loading={ setModeMutation.isLoading && setModeMutation.variables?.mode.name === 'semi2' }
                onClick={ () => setModeMutation.mutate({ mode: { name: 'semi2' } }) }
            >Semi2</ModeButton>
            <ModeButton
                className="flex-[20%]"
                disabled={ disabled }
                active={ value?.name === 'perf' }
                loading={ setModeMutation.isLoading && setModeMutation.variables?.mode.name === 'perf' }
                onClick={ () => setModeMutation.mutate({ mode: { name: 'perf' } }) }
            >Perf</ModeButton>
        </div>
    );
};
