import React from 'react';
import { LucideIcon } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
    children: React.ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: LucideIcon;
    iconRight?: LucideIcon;
    disabled?: boolean;
    fullWidth?: boolean;
    onClick?: () => void;
    className?: string;
}

const sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-lg',
    md: 'px-5 py-2.5 text-sm gap-2 rounded-xl',
    lg: 'px-6 py-4 text-base gap-2 rounded-xl',
};

const variantClasses: Record<ButtonVariant, string> = {
    primary:
        'bg-t-accent text-t-bg font-bold shadow-lg shadow-t-accent/20 hover:opacity-90 active:scale-[0.98]',
    secondary:
        'bg-transparent border border-t-accent/40 text-t-accent font-bold hover:bg-t-accent/10 active:scale-[0.98]',
    tertiary:
        'bg-transparent text-t-accent font-semibold hover:text-t-accent/80 active:scale-[0.98]',
};

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    iconRight: IconRight,
    disabled = false,
    fullWidth = false,
    onClick,
    className = '',
}) => {
    const iconSize = size === 'sm' ? 14 : size === 'md' ? 16 : 18;

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={[
                'inline-flex items-center justify-center transition-all',
                sizeClasses[size],
                variantClasses[variant],
                fullWidth ? 'w-full' : '',
                disabled ? 'opacity-50 cursor-not-allowed shadow-none' : '',
                className,
            ]
                .filter(Boolean)
                .join(' ')}
        >
            {Icon && <Icon size={iconSize} />}
            {children}
            {IconRight && <IconRight size={iconSize} />}
        </button>
    );
};

export default Button;
