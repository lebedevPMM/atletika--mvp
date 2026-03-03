import React, { useState } from 'react';
import { useTheme } from '../ThemeContext';
import { useSocial } from './SocialContext';
import { ScreenName } from '../../types';
import { ArrowLeft, ChevronRight, Check, Briefcase, Zap, HelpCircle, Heart, Flame, LayoutGrid } from 'lucide-react';
import { RequestType, BusinessRequest, BusinessIndustry } from './types';

interface RequestCreateScreenProps {
    onNavigate: (screen: ScreenName) => void;
}

const RequestCreateScreen: React.FC<RequestCreateScreenProps> = ({ onNavigate }) => {
    const { theme } = useTheme();
    const { addRequest, currentUser } = useSocial();
    const isDark = theme === 'dark';

    const [step, setStep] = useState<1 | 2>(1);

    // Form State
    const [type, setType] = useState<RequestType | null>(null);
    const [category, setCategory] = useState<BusinessIndustry | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isUrgent, setIsUrgent] = useState(false);

    const handleSubmit = () => {
        // Validation loose enough for MVP (testing)
        if (!currentUser || !type || !category || !title || !description) return;

        const newRequest: BusinessRequest = {
            id: `r_${Date.now()}`,
            authorId: currentUser.id,
            type,
            category,
            title,
            description,
            urgency: isUrgent ? 'high' : 'normal',
            status: 'approved', // Auto-approve for MVP
            views: 0,
            responses: 0,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // 30 days
        };

        addRequest(newRequest);
        onNavigate('community'); // Go back to feed
    };

    const isStep1Valid = type && category;
    // Relaxed validation for testing: just check not empty
    const isStep2Valid = title.length > 0 && description.length > 0;

    const requestTypes: { id: RequestType; label: string; icon: any; color: string; desc: string }[] = [
        { id: 'need', label: 'Business Need', icon: Zap, color: 'text-red-500', desc: 'Find contractors, employees, or solutions' },
        { id: 'offer', label: 'Offer', icon: Briefcase, color: 'text-green-500', desc: 'Exclusive deals or opportunities for members' },
        { id: 'ask', label: 'Ask Expert', icon: HelpCircle, color: 'text-blue-500', desc: 'Get advice or contacts' },
        { id: 'lifestyle', label: 'Lifestyle', icon: Heart, color: 'text-purple-500', desc: 'Travel, family, schools, hobbies' },
    ];

    const categories: BusinessIndustry[] = ['Technology', 'Real Estate', 'Finance', 'Logistics', 'Retail', 'Healthcare', 'Consulting', 'Energy', 'Other'];

    return (
        <div className={`min-h-screen flex flex-col ${isDark ? 'bg-zinc-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
            {/* Header */}
            <div className={`p-4 flex items-center gap-4 sticky top-0 z-20 ${isDark ? 'bg-zinc-950/80' : 'bg-white/80'} backdrop-blur-md`}>
                <button onClick={() => step === 1 ? onNavigate('BACK') : setStep(1)} className={`p-2 rounded-full ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-gray-200'}`}>
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-lg font-bold">New Request</h1>
                    <div className="flex gap-1 mt-1">
                        <div className={`h-1 w-8 rounded-full ${step >= 1 ? 'bg-cyan-500' : 'bg-gray-300'}`} />
                        <div className={`h-1 w-8 rounded-full ${step >= 2 ? 'bg-cyan-500' : 'bg-gray-300'}`} />
                    </div>
                </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto pb-24">
                {step === 1 ? (
                    <div className="space-y-8 animate-fade-in">
                        {/* Type Selection */}
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-widest opacity-50 mb-4">1. What is your goal?</h2>
                            <div className="grid grid-cols-1 gap-3">
                                {requestTypes.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setType(t.id)}
                                        className={`p-4 rounded-xl border text-left flex items-start gap-4 transition-all ${type === t.id
                                                ? (isDark ? 'bg-zinc-800 border-cyan-500/50 ring-1 ring-cyan-500' : 'bg-white border-cyan-500 ring-1 ring-cyan-500 shadow-md')
                                                : (isDark ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800' : 'bg-white border-gray-200 shadow-sm hover:bg-gray-50')
                                            }`}
                                    >
                                        <div className={`p-3 rounded-full bg-opacity-10 ${t.color.replace('text-', 'bg-')} ${t.color}`}>
                                            <t.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-base mb-1">{t.label}</div>
                                            <div className={`text-xs ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>{t.desc}</div>
                                        </div>
                                        {type === t.id && <div className="ml-auto text-cyan-500"><Check className="w-5 h-5" /></div>}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Category Selection */}
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-widest opacity-50 mb-4">2. Select Industry</h2>
                            <div className="flex flex-wrap gap-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setCategory(cat)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${category === cat
                                                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                                                : (isDark ? 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800' : 'bg-gray-200 text-gray-600 hover:bg-gray-300')
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </section>
                    </div>
                ) : (
                    <div className="space-y-6 animate-fade-in">
                        {/* Review Type */}
                        <div className={`flex items-center gap-3 p-3 rounded-lg border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-gray-100 border-gray-200'}`}>
                            <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${isDark ? 'bg-zinc-800' : 'bg-white'}`}>
                                {type}
                            </div>
                            <div className="text-sm font-medium opacity-70 flex items-center gap-1">
                                <LayoutGrid className="w-3 h-3" /> {category}
                            </div>
                            <button onClick={() => setStep(1)} className="ml-auto text-xs font-bold text-cyan-500">EDIT</button>
                        </div>

                        {/* Title Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold uppercase tracking-wide opacity-70">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="e.g., Seeking Investment for Series A"
                                className={`w-full p-4 rounded-xl text-lg font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500 ${isDark ? 'bg-zinc-900 placeholder-zinc-600' : 'bg-gray-100 placeholder-gray-400'}`}
                            />
                        </div>

                        {/* Description Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold uppercase tracking-wide opacity-70">Description</label>
                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Describe your request in detail..."
                                rows={6}
                                className={`w-full p-4 rounded-xl text-base font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none ${isDark ? 'bg-zinc-900 placeholder-zinc-600' : 'bg-gray-100 placeholder-gray-400'}`}
                            />
                        </div>

                        {/* Urgency Toggle */}
                        <button
                            onClick={() => setIsUrgent(!isUrgent)}
                            className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all ${isUrgent
                                    ? 'bg-red-500/10 border-red-500 text-red-500'
                                    : (isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-gray-50 border-gray-200 text-gray-500')
                                }`}
                        >
                            <div className={`p-2 rounded-full ${isUrgent ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-zinc-800'}`}>
                                <Flame className="w-5 h-5" />
                            </div>
                            <div className="text-left flex-1">
                                <div className="font-bold">High Urgency</div>
                                <div className="text-xs opacity-70">Mark this request as critical (expires in 48h)</div>
                            </div>
                            {isUrgent && <Check className="w-5 h-5" />}
                        </button>
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className={`p-4 border-t ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-gray-200'}`}>
                {step === 1 ? (
                    <button
                        onClick={() => setStep(2)}
                        disabled={!isStep1Valid}
                        className={`w-full py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 transition-all ${isStep1Valid
                                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25 active:scale-[0.98]'
                                : (isDark ? 'bg-zinc-800 text-zinc-600' : 'bg-gray-200 text-gray-400')
                            }`}
                    >
                        Next Step
                        <ChevronRight className="w-5 h-5" />
                    </button>
                ) : (
                    <div className="space-y-3">
                        {/* Helper Feedback Message */}
                        {!isStep2Valid && (
                            <div className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center animate-fade-in">
                                Please enter a title and description to publish.
                            </div>
                        )}
                        <button
                            onClick={handleSubmit}
                            disabled={!isStep2Valid}
                            className={`w-full py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 transition-all ${isStep2Valid
                                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25 active:scale-[0.98]'
                                    : (isDark ? 'bg-zinc-800 text-zinc-600' : 'bg-gray-200 text-gray-400')
                                }`}
                        >
                            Publish Request
                            <Check className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RequestCreateScreen;
