import { twMerge } from 'tailwind-merge';
import z from 'zod';

import { RgbModeSchema } from '@/common/schema';
import { ModeButton } from '@/components/ModeButton';
import { trpc } from '@/utils/trpc';

import { ColorcycleRgbModePart } from './ColorcycleRgbModePart';
import { StaticRgbModePart } from './StaticRgbModePart';

export const RgbModePart = ({
    className,
    disabled,
    value = null
}: {
    className?: string,
    disabled?: boolean,
    value?: z.TypeOf<typeof RgbModeSchema> | null
}) => {
    const setRgbModeMutation = trpc.setRgbMode.useMutation();

    return (
        <div className={ twMerge(className) }>
            <div className="flex gap-3">
                <ModeButton
                    className="flex-[20%]"
                    disabled={ disabled }
                    active={ value?.name === 'off' }
                    loading={ setRgbModeMutation.isLoading && setRgbModeMutation.variables?.mode.name === 'off' }
                    onClick={ () => setRgbModeMutation.mutate({ mode: { name: 'off' } }) }
                >Off</ModeButton>

                <ModeButton
                    className="flex-[20%]"
                    disabled={ disabled }
                    active={ value?.name === 'default' }
                    loading={ setRgbModeMutation.isLoading && setRgbModeMutation.variables?.mode.name === 'default' }
                    onClick={ () => setRgbModeMutation.mutate({ mode: { name: 'default' } }) }
                >Default</ModeButton>

                <ModeButton
                    className="flex-[20%]"
                    disabled={ disabled }
                    active={ value?.name === 'static' }
                    loading={ setRgbModeMutation.isLoading && setRgbModeMutation.variables?.mode.name === 'static' }
                    onClick={ () => setRgbModeMutation.mutate({ mode: { name: 'static', params: { color: { r: 255, g: 255, b: 255 } } } }) }
                >Static</ModeButton>

                <ModeButton
                    className="flex-[20%]"
                    disabled={ disabled }
                    active={ value?.name === 'colorcycle' }
                    loading={ setRgbModeMutation.isLoading && setRgbModeMutation.variables?.mode.name === 'colorcycle' }
                    onClick={ () => setRgbModeMutation.mutate({ mode: { name: 'colorcycle', params: { speed: 1 } } }) }
                >Colorcycle</ModeButton>
            </div>

            { value?.name === 'static' && (
                <StaticRgbModePart
                    value={ value }
                    disabled={ disabled }
                />
            ) }

            { value?.name === 'colorcycle' && (
                <ColorcycleRgbModePart
                    value={ value }
                    disabled={ disabled }
                />
            ) }
        </div>
    );
};
