import React from 'react';
import { useSocial } from './SocialContext';
import { SocialStatus } from './types';
import { useTheme } from '../ThemeContext';

const StatusBeaconSelector: React.FC = () => {
    const { currentUser, updateStatus } = useSocial();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    if (!currentUser || !currentUser.isGeofenced) return null;

    const statuses: { id: SocialStatus, label: string, color: string, ring: string }[] = [
        { id: 'green', label: 'Ищу партнёра', color: 'bg-green-500', ring: 'ring-green-500/30' },
        { id: 'yellow', label: 'Открыт к общению', color: 'bg-yellow-500', ring: 'ring-yellow-500/30' },
        { id: 'red', label: 'В зоне (не беспокоить)', color: 'bg-red-500', ring: 'ring-red-500/30' },
    ];

    return (
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
            {statuses.map((status) => {
                const isActive = currentUser.status === status.id;
                return (
                    <button
                        key={status.id}
                        onClick={() => updateStatus(status.id)}
                        className={`
                            flex items-center gap-2 px-3 py-2 rounded-full border transition-all whitespace-nowrap
                            ${isActive
                                ? `${isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-gray-200'} shadow-md ring-2 ${status.ring}`
                                : `border-transparent opacity-60 hover:opacity-100 ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-gray-100'}`
                            }
                        `}
                    >
                        <div className={`w-2.5 h-2.5 rounded-full ${status.color}`} />
                        <span className={`text-xs font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
                            {status.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default StatusBeaconSelector;
