import React, { ReactNode } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BentoGridProps {
    children: ReactNode;
    className?: string;
}

export const BentoGrid: React.FC<BentoGridProps> = ({ children, className }) => {
    return (
        <div
            className={twMerge(
                clsx(
                    'grid grid-cols-12 auto-rows-[minmax(160px,auto)] gap-4 p-5',
                    className
                )
            )}
        >
            {children}
        </div>
    );
};

interface BentoItemProps {
    children: ReactNode;
    className?: string;
    span?: {
        mobile?: number; // 1-12
        desktop?: number; // 1-12
    };
}

export const BentoItem: React.FC<BentoItemProps> = ({ children, className, span }) => {
    const colSpanClass = `col-span-${span?.mobile || 12} md:col-span-${span?.desktop || 6}`;

    return (
        <div
            className={twMerge(
                clsx(
                    colSpanClass,
                    'glass-panel rounded-squircle p-4 relative overflow-hidden group transition-all duration-300 hover:border-white/10',
                    className
                )
            )}
        >
            {children}
        </div>
    );
};
