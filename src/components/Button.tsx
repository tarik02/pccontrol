import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
    loading?: boolean,
    disabled?: boolean,
    className?: string,
    children?: ReactNode,
    onClick: () => void
};

export const Button = (props: Props) => {
    const {
        loading,
        className,
        disabled,
        children,
        ...restProps
    } = props;

    return (
        <button
            { ...restProps }
            disabled={ disabled }
            className={ twMerge(
                'py-2 px-5 rounded transition',
                'select-none cursor-pointer',
                className,
                'active:translate-y-1',
                'disabled:translate-y-0 disabled:bg-gray-400',
                loading && 'translate-y-1'
            ) }
        >
            { children }
        </button>
    );
};
