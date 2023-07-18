import { CSSProperties } from 'react';
import { RgbColorPicker } from 'react-colorful';
import { twMerge } from 'tailwind-merge';
import z from 'zod';

import { RgbModeSchema } from '@/common/schema';
import { trpc } from '@/utils/trpc';

const colors = [
    { r: 0, g: 0, b: 0 },
    { r: 0, g: 0, b: 255 },
    { r: 0, g: 255, b: 0 },
    { r: 0, g: 255, b: 255 },
    { r: 255, g: 0, b: 0 },
    { r: 255, g: 0, b: 255 },
    { r: 255, g: 255, b: 0 },
    { r: 255, g: 255, b: 255 }
];

const ColorSwatch = ({
    color,
    active = false,
    loading = false,
    disabled = false,
    onClick
}: {
    color: { r: number, g: number, b: number },
    active?: boolean,
    loading?: boolean,
    disabled?: boolean,
    onClick: () => void
}) => {
    return (
        <button
            disabled={ disabled }
            className={ twMerge(
                'cursor-pointer',
                'h-[38px]',
                'shadow',
                'border border-gray-700',
                'active:translate-y-1 transition',
                loading && 'translate-y-1',
                'disabled:translate-y-0 disabled:opacity-50 disabled:cursor-default'
            ) }
            style={ {
                'backgroundColor': `rgb(${ color.r }, ${ color.g }, ${ color.b })`,
                '--tw-shadow': active ? '0px 0px 3px 2px rgba(255,255,255,0.5)' : undefined
            } as CSSProperties }
            onClick={ onClick }
        />
    );
};

export const StaticRgbModePart = ({
    value,
    disabled = false
}: {
    value: z.TypeOf<typeof RgbModeSchema> & { name: 'static' },
    disabled?: boolean
}) => {
    const setRgbModeMutation = trpc.setRgbMode.useMutation();

    const currentValue = setRgbModeMutation.isLoading && setRgbModeMutation.variables?.mode.name === 'static'
        ? setRgbModeMutation.variables.mode
        : value;

    return (
        <div className="mt-5 flex flex-col sm:flex-row gap-5">
            <div className="flex-[50%]">
                <RgbColorPicker
                    className={ twMerge(
                        '!w-full',
                        disabled && 'opacity-50 pointer-events-none'
                    ) }
                    color={ {
                        r: currentValue.params.color.r,
                        g: currentValue.params.color.g,
                        b: currentValue.params.color.b
                    } }
                    onChange={ value => {
                        setRgbModeMutation.mutate({
                            mode: {
                                name: 'static',
                                params: {
                                    color: value
                                }
                            }
                        });
                    } }
                    style={ { width: '50%' } }
                />
            </div>

            <div className="flex-[50%] grid grid-cols-4 gap-4 content-start">
                { colors.map(
                    (color, i) => (
                        <ColorSwatch
                            key={ i }
                            color={ color }
                            disabled={ disabled }
                            active={
                                currentValue.params.color.r === color.r &&
                                currentValue.params.color.g === color.g &&
                                currentValue.params.color.b === color.b
                            }
                            loading={
                                setRgbModeMutation.isLoading &&
                                setRgbModeMutation.variables?.mode.name === 'static' &&
                                setRgbModeMutation.variables?.mode.params.color.r === color.r &&
                                setRgbModeMutation.variables?.mode.params.color.g === color.g &&
                                setRgbModeMutation.variables?.mode.params.color.b === color.b
                            }
                            onClick={ () => {
                                setRgbModeMutation.mutate({
                                    mode: {
                                        name: 'static',
                                        params: {
                                            color
                                        }
                                    }
                                });
                            } }
                        />
                    )
                ) }
            </div>
        </div>
    );
};
