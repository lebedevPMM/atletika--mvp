import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
    icon?: LucideIcon;
    title?: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    icon: Icon = Inbox,
    title = 'Пока пусто',
    description,
    actionLabel,
    onAction,
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-14 h-14 rounded-full bg-t-accent/10 flex items-center justify-center">
                <Icon className="w-7 h-7 text-t-accent" />
            </div>
            <h4 className="text-base font-semibold text-t-text">{title}</h4>
            {description && (
                <p className="text-sm text-t-text-muted text-center max-w-[260px]">{description}</p>
            )}
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="mt-2 px-5 py-2 rounded-lg bg-t-accent text-t-bg font-medium text-sm hover:opacity-90 transition-opacity"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
