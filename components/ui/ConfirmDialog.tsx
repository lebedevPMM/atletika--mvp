import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    destructive?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    open,
    title,
    message,
    confirmLabel = 'Подтвердить',
    cancelLabel = 'Отмена',
    destructive = false,
    onConfirm,
    onCancel,
}) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

            {/* Dialog */}
            <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4 border border-gray-200 dark:border-zinc-800">
                {destructive && (
                    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                    </div>
                )}
                <h3 className="text-lg font-bold text-center text-gray-900 dark:text-white">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-zinc-400 text-center">{message}</p>
                <div className="flex gap-3 pt-2">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 rounded-xl font-bold text-sm bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors active:scale-[0.98] ${
                            destructive
                                ? 'bg-red-500 text-white hover:bg-red-600'
                                : 'bg-t-accent text-t-bg hover:opacity-90'
                        }`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
