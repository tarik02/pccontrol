import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
    loading?: boolean,
    active?: boolean,
    disabled?: boolean,
    className?: string,
    children?: ReactNode,
    onClick: () => void
};

export const ModeButton = (props: Props) => {
    const {
        loading,
        active,
        disabled,
        className,
        children,
        ...restProps
    } = props;

    return (
        <button
            { ...restProps }
            disabled={ disabled }
            className={ twMerge(
                'p-3 border border-white border-dashed text-center',
                'select-none cursor-pointer active:translate-y-1 transition',
                loading && 'translate-y-1',
                active && 'bg-gray-800 border-gray-800',
                'disabled:translate-y-0 disabled:opacity-50 disabled:cursor-default',
                className
            ) }
        >
            { children }
        </button>
    );
};
