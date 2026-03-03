import React from 'react';
import { useSocial } from './SocialContext';
import { useTheme } from '../ThemeContext';
import { MapPin, Clock } from 'lucide-react';
import { ScreenName } from '../../types';

interface EventsListProps {
    onNavigate?: (screen: ScreenName) => void;
}

const EventsList: React.FC<EventsListProps> = ({ onNavigate }) => {
    const { events, allMembers, selectEvent, isGuest } = useSocial();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Helper to format date
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
    };

    const formatTime = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(date);
    };

    const getAttendeesAvatars = (ids: string[]) => {
        return ids.slice(0, 3).map(id => {
            const user = allMembers.find(u => u.id === id);
            return user ? user.avatarUrl : null;
        }).filter(Boolean);
    };

    return (
        <div className="space-y-4 pb-20">
            {events.map((event) => {
                const attendeesAvatars = getAttendeesAvatars(event.attendees);

                return (
                    <div
                        key={event.id}
                        onClick={() => {
                            if (isGuest) {
                                onNavigate?.('onboarding_application');
                                return;
                            }
                            selectEvent(event.id);
                            onNavigate?.('event_details');
                        }}
                        className={`p-4 rounded-xl border relative overflow-hidden transition-all active:scale-[0.98] ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200 shadow-sm'
                            }`}
                    >
                        {/* Type Badge */}
                        <div className={`absolute top-4 right-4 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${event.type === 'sport' ? 'bg-orange-500/10 text-orange-500' :
                            event.type === 'business' ? 'bg-blue-500/10 text-blue-500' :
                                'bg-purple-500/10 text-purple-500'
                            }`}>
                            {event.type}
                        </div>

                        <div className="flex gap-4">
                            {/* Date Box */}
                            <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-lg shrink-0 ${isDark ? 'bg-zinc-800' : 'bg-gray-100'
                                }`}>
                                <span className="text-xs font-bold uppercase text-red-500">
                                    {new Intl.DateTimeFormat('en-US', { month: 'short' }).format(event.date)}
                                </span>
                                <span className={`text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {event.date.getDate()}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h3 className={`font-bold text-base mb-1 truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {event.title}
                                </h3>

                                <div className="flex items-center gap-3 text-xs opacity-70 mb-3">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {formatTime(event.date)}
                                    </div>
                                    <div className="flex items-center gap-1 truncate">
                                        <MapPin className="w-3 h-3" />
                                        {event.location}
                                    </div>
                                </div>

                                {/* Footer: Attendees & Price */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-2">
                                            {attendeesAvatars.map((url, i) => (
                                                <img
                                                    key={i}
                                                    src={url || ''}
                                                    className="w-6 h-6 rounded-full border-2 border-zinc-900"
                                                    alt="Att"
                                                />
                                            ))}
                                        </div>
                                        {event.attendees.length > 0 && (
                                            <span className="text-xs opacity-50">
                                                +{event.attendees.length} going
                                            </span>
                                        )}
                                    </div>

                                    {event.price && (
                                        <div className={`text-xs font-bold px-2 py-1 rounded ${isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {event.price}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default EventsList;
