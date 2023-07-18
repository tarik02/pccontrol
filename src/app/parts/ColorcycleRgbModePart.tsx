import * as Slider from '@radix-ui/react-slider';
import { twMerge } from 'tailwind-merge';
import z from 'zod';

import { RgbModeSchema } from '@/common/schema';
import { trpc } from '@/utils/trpc';

export const ColorcycleRgbModePart = ({
    value,
    disabled = false
}: {
    value: z.TypeOf<typeof RgbModeSchema> & { name: 'colorcycle' },
    disabled?: boolean
}) => {
    const setRgbModeMutation = trpc.setRgbMode.useMutation();

    const currentValue = setRgbModeMutation.isLoading && setRgbModeMutation.variables?.mode.name === 'colorcycle'
        ? setRgbModeMutation.variables.mode
        : value;

    return (
        <div className="mt-5 flex gap-5">
            <Slider.Root
                disabled={ disabled }
                className={ twMerge(
                    'relative flex items-center select-none touch-none h-5 grow',
                    disabled && 'opacity-50'
                ) }
                min={ 0.1 }
                max={ 10 }
                step={ 0.1 }
                value={ [ currentValue.params.speed ] }
                onValueChange={ value => {
                    setRgbModeMutation.mutate({
                        mode: {
                            name: 'colorcycle',
                            params: {
                                speed: value[ 0 ]
                            }
                        }
                    });
                } }
            >
                <Slider.Track className="bg-blackA10 bg-gray-500 relative grow rounded-full h-[3px]">
                    <Slider.Range className="absolute bg-white rounded-full h-full" />
                </Slider.Track>
                <Slider.Thumb
                    className="block w-5 h-5 bg-white shadow-[0_2px_10px] shadow-blackA7 rounded-[10px] hover:bg-violet3 focus:outline-none focus:shadow-[0_0_0_5px] focus:shadow-blackA8"
                    aria-label="Volume"
                />
            </Slider.Root>

            <div>{ currentValue.params.speed.toFixed(1) }</div>
        </div>
    );
};
