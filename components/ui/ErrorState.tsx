import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
    message?: string;
    onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({
    message = 'Что-то пошло не так',
    onRetry,
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>
            <p className="text-sm text-t-text-muted text-center max-w-[240px]">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="px-5 py-2 rounded-lg bg-t-accent text-t-bg font-medium text-sm hover:opacity-90 transition-opacity"
                >
                    Повторить
                </button>
            )}
        </div>
    );
};

export default ErrorState;
