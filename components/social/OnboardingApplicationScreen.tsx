import React, { useState } from 'react';
import { useSocial } from './SocialContext';
import { useTheme } from '../ThemeContext';
import { BusinessIndustry, SportLevel } from './types';
import { ScreenName } from '../../types';
import { ArrowLeft, Camera, Briefcase, Dumbbell, Check, ChevronRight, Loader2 } from 'lucide-react';

interface OnboardingApplicationScreenProps {
    onNavigate: (screen: ScreenName) => void;
}

const OnboardingApplicationScreen: React.FC<OnboardingApplicationScreenProps> = ({ onNavigate }) => {
    const { submitApplication } = useSocial();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Bio, 2: Business, 3: Sport, 4: Success
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        bio: '',
        company: '',
        role: '',
        industry: 'Technology' as BusinessIndustry,
        sports: [] as string[],
        level: 'amateur' as SportLevel
    });

    const INDUSTRIES: BusinessIndustry[] = [
        'Technology', 'Finance', 'Real Estate', 'Logistics', 'Retail', 'Healthcare', 'Consulting', 'Energy', 'Other'
    ];

    const SPORTS = ['Running', 'Triathlon', 'Tennis', 'Golf', 'CrossFit', 'Yoga', 'Swimming', 'Boxing'];

    const handleNext = async () => {
        if (step < 3) {
            setStep(prev => (prev + 1) as any);
        } else {
            // Submit
            setLoading(true);
            await submitApplication(formData);
            setLoading(false);
            setStep(4);
        }
    };

    if (step === 4) {
        return (
            <div className={`min-h-screen flex flex-col items-center justify-center p-8 text-center ${isDark ? 'bg-zinc-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
                <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                    <Check className="w-12 h-12 text-green-500" />
                </div>
                <h2 className="text-2xl font-black italic uppercase mb-2">Заявка отправлена</h2>
                <p className={`text-sm mb-8 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                    Мы проверим ваши данные в течение 24 часов. Вы получите уведомление, когда доступ будет открыт.
                </p>
                <button
                    onClick={() => onNavigate('community')}
                    className="w-full bg-cyan-600 text-white py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-cyan-500 transition-colors"
                >
                    Вернуться в комьюнити
                </button>
            </div>
        );
    }

    return (
        <div className={`min-h-screen flex flex-col ${isDark ? 'bg-zinc-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
            {/* Header */}
            <div className={`p-4 flex items-center gap-4 border-b ${isDark ? 'border-zinc-800 bg-zinc-900' : 'border-gray-200 bg-white'}`}>
                <button onClick={() => step === 1 ? onNavigate('community') : setStep(prev => (prev - 1) as any)} className="p-2 -ml-2">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex-1">
                    <div className="flex gap-1 mb-1">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-cyan-500' : isDark ? 'bg-zinc-800' : 'bg-gray-200'}`} />
                        ))}
                    </div>
                    <h1 className="text-xs font-bold uppercase tracking-wider opacity-60">Шаг {step} из 3</h1>
                </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
                {step === 1 && (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-black italic uppercase mb-2">Расскажите о себе</h2>
                            <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                                Это увидят другие члены клуба.
                            </p>
                        </div>

                        <div className="mx-auto w-24 h-24 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center border-2 border-dashed border-gray-400 dark:border-zinc-600 cursor-pointer hover:border-cyan-500 transition-colors relative">
                            <Camera className="w-8 h-8 text-gray-400" />
                            <div className="absolute -bottom-1 -right-1 bg-cyan-500 rounded-full p-1.5 border-2 border-white dark:border-zinc-950">
                                <div className="w-2 h-2 bg-white rounded-full ml-0.5" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider opacity-70">Обо мне (Био)</label>
                            <textarea
                                value={formData.bio}
                                onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                                placeholder="Предприниматель, триатлет, ищу партнеров..."
                                className={`w-full h-32 p-4 rounded-xl resize-none ${isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-200 text-gray-900'} border focus:outline-none focus:border-cyan-500 transition-colors`}
                            />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-black italic uppercase mb-2">Бизнес профиль</h2>
                            <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                                Для Smart-Match и нетворкинга.
                            </p>
                        </div>

                        <div className="flex justify-center mb-4">
                            <Briefcase className="w-12 h-12 text-cyan-500 opacity-80" />
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider opacity-70">Компания</label>
                                <input
                                    type="text"
                                    value={formData.company}
                                    onChange={e => setFormData(prev => ({ ...prev, company: e.target.value }))}
                                    className={`w-full p-4 rounded-xl ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'} border focus:outline-none focus:border-cyan-500`}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider opacity-70">Должность</label>
                                <input
                                    type="text"
                                    value={formData.role}
                                    onChange={e => setFormData(prev => ({ ...prev, role: e.target.value }))}
                                    className={`w-full p-4 rounded-xl ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'} border focus:outline-none focus:border-cyan-500`}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider opacity-70">Сфера</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {INDUSTRIES.map(ind => (
                                        <button
                                            key={ind}
                                            onClick={() => setFormData(prev => ({ ...prev, industry: ind }))}
                                            className={`p-3 rounded-lg text-xs font-bold text-left truncate transition-colors ${formData.industry === ind
                                                ? 'bg-cyan-500 text-white'
                                                : isDark ? 'bg-zinc-900 hover:bg-zinc-800' : 'bg-white hover:bg-gray-100 border border-gray-200'
                                                }`}
                                        >
                                            {ind}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-black italic uppercase mb-2">Спорт интересы</h2>
                            <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                                Найдите единомышленников.
                            </p>
                        </div>

                        <div className="flex justify-center mb-4">
                            <Dumbbell className="w-12 h-12 text-purple-500 opacity-80" />
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider opacity-70">Основные виды</label>
                                <div className="flex flex-wrap gap-2">
                                    {SPORTS.map(sport => {
                                        const isSelected = formData.sports.includes(sport);
                                        return (
                                            <button
                                                key={sport}
                                                onClick={() => setFormData(prev => ({
                                                    ...prev,
                                                    sports: isSelected
                                                        ? prev.sports.filter(s => s !== sport)
                                                        : [...prev.sports, sport]
                                                }))}
                                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${isSelected
                                                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                                                    : isDark ? 'bg-zinc-900 hover:bg-zinc-800' : 'bg-white hover:bg-gray-100 border border-gray-200'
                                                    }`}
                                            >
                                                {sport}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider opacity-70">Уровень</label>
                                <div className="flex bg-gray-100 dark:bg-zinc-900 p-1 rounded-xl">
                                    {(['beginner', 'amateur', 'pro'] as SportLevel[]).map(level => (
                                        <button
                                            key={level}
                                            onClick={() => setFormData(prev => ({ ...prev, level }))}
                                            className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${formData.level === level
                                                ? 'bg-white dark:bg-zinc-800 shadow-sm text-gray-900 dark:text-white'
                                                : 'text-gray-400 dark:text-zinc-500'
                                                }`}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Action */}
            <div className={`p-6 border-t ${isDark ? 'border-zinc-800 bg-zinc-950' : 'border-gray-200 bg-gray-50'}`}>
                <button
                    onClick={handleNext}
                    disabled={loading}
                    className="w-full bg-cyan-600 text-white py-4 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-cyan-500 active:scale-[0.98] transition-all disabled:opacity-70"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            {step === 3 ? 'Отправить заявку' : 'Далее'}
                            <ChevronRight className="w-5 h-5" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default OnboardingApplicationScreen;
