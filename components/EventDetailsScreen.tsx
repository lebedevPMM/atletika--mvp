import React, { useState, useEffect } from 'react';
import { useSocial } from './social/SocialContext';
import { useTheme } from './ThemeContext';
import { ArrowLeft, Calendar, MapPin, Users, Heart, Share2, DollarSign, ExternalLink, Check } from 'lucide-react';
import { ScreenName } from '../types';

interface EventDetailsScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const EventDetailsScreen: React.FC<EventDetailsScreenProps> = ({ onNavigate }) => {
  const { events, selectedEventId, allMembers, currentUser, toggleEventAttendance } = useSocial();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Find event
  const event = events.find(e => e.id === selectedEventId);

  // Derived State
  const isGoing = event && currentUser ? event.attendees.includes(currentUser.id) : false;

  const handleRSVP = () => {
    if (event) {
      toggleEventAttendance(event.id);
    }
  };

  if (!event) {
    return (
      <div className={`flex flex-col items-center justify-center h-screen ${isDark ? 'bg-zinc-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <p>Event not found or invalid ID.</p>
        <button onClick={() => onNavigate('BACK')} className="mt-4 text-cyan-500 font-bold">Go Back</button>
      </div>
    );
  }

  const organizer = allMembers.find(u => u.id === event.organizerId);

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-zinc-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header Image Area */}
      <div className="relative h-64 w-full">
        <img
          src={event.imageUrl || 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80'}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
          <h1 className="text-2xl font-black text-white leading-tight shadow-sm drop-shadow-md">
            {event.title}
          </h1>
        </div>
        {/* Back Button */}
        <button onClick={() => onNavigate('BACK')} className="absolute top-4 left-4 p-2 rounded-full bg-black/40 backdrop-blur text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 p-6 space-y-6 pb-24 relative -mt-6 rounded-t-3xl bg-inherit"> {/* Overlap effect */}
        {/* Meta Row */}
        <div className="flex items-center gap-4 text-sm font-medium opacity-80">
          <div className={`px-3 py-1 rounded-full uppercase text-xs font-bold tracking-wider ${event.type === 'sport' ? 'bg-orange-500/10 text-orange-500' :
              event.type === 'business' ? 'bg-blue-500/10 text-blue-500' :
                'bg-purple-500/10 text-purple-500'
            }`}>
            {event.type}
          </div>
          {event.price ? (
            <span className="flex items-center gap-1 text-green-500"><DollarSign className="w-4 h-4" /> {event.price}</span>
          ) : (
            <span className="text-green-500">Free</span>
          )}
        </div>

        {/* Date & Location */}
        <div className={`p-4 rounded-xl space-y-3 ${isDark ? 'bg-zinc-900' : 'bg-white shadow-sm border border-gray-100'}`}>
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <div className="font-bold text-lg">
                {new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(event.date)}
              </div>
              <div className="opacity-60 text-sm">
                {new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(event.date)}
              </div>
            </div>
          </div>
          <div className="h-px bg-current opacity-10" />
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <div className="font-bold text-base">{event.location}</div>
              <button className="text-xs text-cyan-500 font-bold mt-1 flex items-center gap-1">
                Open Maps <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase opacity-50 tracking-wider">About Event</h3>
          <p className={`leading-relaxed ${isDark ? 'text-zinc-300' : 'text-gray-600'}`}>
            {event.description}
          </p>
        </div>

        {/* Organizer */}
        {organizer && (
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase opacity-50 tracking-wider">Organizer</h3>
            <div className={`p-3 rounded-lg flex items-center gap-3 ${isDark ? 'bg-zinc-900' : 'bg-white border'}`}>
              <img src={organizer.avatarUrl} className="w-10 h-10 rounded-full" alt={organizer.nickname} />
              <div>
                <div className="font-bold">{organizer.firstName} {organizer.lastName}</div>
                <div className="text-xs opacity-60">{organizer.business.companyName}</div>
              </div>
            </div>
          </div>
        )}

        {/* Attendees */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase opacity-50 tracking-wider">
            Going ({event.attendees.length})
          </h3>
          <div className="flex -space-x-2 overflow-hidden py-1">
            {event.attendees.map(id => {
              const u = allMembers.find(m => m.id === id);
              return u ? (
                <img key={id} src={u.avatarUrl} className="w-8 h-8 rounded-full border-2 border-inherit" alt={u.nickname} />
              ) : null;
            })}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className={`fixed bottom-0 left-0 right-0 p-4 border-t ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-gray-200'}`}>
        <div className="flex gap-3 max-w-md mx-auto">
          <button className={`p-4 rounded-xl border flex items-center justify-center ${isDark ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800' : 'bg-gray-100 border-gray-300 hover:bg-gray-200'}`}>
            <Share2 className="w-6 h-6" />
          </button>
          <button
            onClick={handleRSVP}
            className={`flex-1 p-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] ${isGoing
                ? (isDark ? 'bg-green-500/20 text-green-500 border border-green-500/50' : 'bg-green-100 text-green-600 border border-green-200')
                : 'bg-cyan-500 text-white shadow-cyan-500/20'
              }`}
          >
            {isGoing ? (
              <>
                <Check className="w-6 h-6" />
                Assigned
              </>
            ) : (
              'Join Event'
            )}
          </button>
          <button className={`p-4 rounded-xl border flex items-center justify-center ${isDark ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800' : 'bg-gray-100 border-gray-300 hover:bg-gray-200'}`}>
            <Heart className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsScreen;