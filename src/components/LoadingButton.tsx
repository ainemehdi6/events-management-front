import React from 'react';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    children: React.ReactNode;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
    loading = false,
    children,
    className = '',
    disabled,
    ...props
}) => {
    return (
        <button
            {...props}
            disabled={loading || disabled}
            className={`relative ${className}`}
        >
            <span className={`${loading ? 'invisible' : 'visible'}`}>{children}</span>
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
        </button>
    );
};