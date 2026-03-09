import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
    message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Загрузка...' }) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 text-t-accent animate-spin" />
            <p className="text-sm text-t-text-muted">{message}</p>
        </div>
    );
};

export default LoadingState;
