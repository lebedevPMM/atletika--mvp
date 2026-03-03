
import React, { useState } from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, Check, Ruler, Weight, Target, Activity, Heart, ArrowRight } from 'lucide-react';

interface OnboardingBioScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const OnboardingBioScreen: React.FC<OnboardingBioScreenProps> = ({ onNavigate }) => {
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [goal, setGoal] = useState<string>('weight_loss');
  const [weight, setWeight] = useState('65');
  const [height, setHeight] = useState('170');

  const goals = [
    { id: 'weight_loss', label: 'Weight Loss', icon: Activity, color: 'bg-orange-900/20 text-orange-500 border-orange-500/30' },
    { id: 'muscle', label: 'Muscle Gain', icon: Target, color: 'bg-cyan-900/20 text-cyan-500 border-cyan-500/30' },
    { id: 'tone', label: 'Tone & Relief', icon: Activity, color: 'bg-purple-900/20 text-purple-500 border-purple-500/30' },
    { id: 'health', label: 'Health', icon: Heart, color: 'bg-green-900/20 text-green-500 border-green-500/30' },
  ];

  return (
    <div className="bg-zinc-950 min-h-screen flex flex-col animate-in fade-in slide-in-from-right-8 duration-500">
      {/* Progress Header */}
      <div className="p-6 pb-2 pt-12">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-1.5 flex-1 bg-cyan-600 rounded-full shadow-[0_0_10px_rgba(8,145,178,0.5)]"></div>
          <div className="h-1.5 flex-1 bg-cyan-600 rounded-full shadow-[0_0_10px_rgba(8,145,178,0.5)]"></div>
          <div className="h-1.5 flex-1 bg-zinc-800 rounded-full"></div>
        </div>
        <h1 className="text-3xl font-black text-white mb-2 leading-tight italic uppercase tracking-tighter">Tell us<br />about yourself</h1>
        <p className="text-zinc-500 text-sm font-medium">We will create a personal workout plan based on your data.</p>
      </div>

      <div className="p-6 space-y-8 flex-1 overflow-y-auto no-scrollbar">

        {/* Gender */}
        <div>
          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wide mb-3">Your Gender</label>
          <div className="flex bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800">
            <button
              onClick={() => setGender('male')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${gender === 'male' ? 'bg-zinc-800 shadow-sm text-white ring-1 ring-white/10' : 'text-zinc-500 hover:text-zinc-300'
                }`}
            >
              Male
            </button>
            <button
              onClick={() => setGender('female')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${gender === 'female' ? 'bg-zinc-800 shadow-sm text-white ring-1 ring-white/10' : 'text-zinc-500 hover:text-zinc-300'
                }`}
            >
              Female
            </button>
          </div>
        </div>

        {/* Biometrics */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wide mb-3">Weight (kg)</label>
            <div className="relative group">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-2xl p-4 text-2xl font-extrabold text-white focus:outline-none focus:bg-zinc-900 focus:border-cyan-600 transition-all text-center placeholder-zinc-700"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-500 shadow-sm pointer-events-none border border-zinc-700">
                <Weight className="w-4 h-4" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wide mb-3">Height (cm)</label>
            <div className="relative group">
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-2xl p-4 text-2xl font-extrabold text-white focus:outline-none focus:bg-zinc-900 focus:border-cyan-600 transition-all text-center placeholder-zinc-700"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-500 shadow-sm pointer-events-none border border-zinc-700">
                <Ruler className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Goals */}
        <div>
          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wide mb-3">Your Goal</label>
          <div className="grid grid-cols-2 gap-3">
            {goals.map((g) => {
              const Icon = g.icon;
              const isSelected = goal === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => setGoal(g.id)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden group ${isSelected
                      ? `border-transparent shadow-lg ${g.color} ring-1 ring-white/10`
                      : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                    }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-colors ${isSelected ? 'bg-white/10 text-current' : 'bg-zinc-800 text-zinc-600'}`}>
                    <Icon className={`w-5 h-5`} />
                  </div>
                  <span className={`font-bold text-sm block ${isSelected ? 'text-current' : 'text-white'}`}>{g.label}</span>

                  {isSelected && (
                    <div className="absolute top-3 right-3 bg-white/20 rounded-full p-1 shadow-sm backdrop-blur-sm">
                      <Check className="w-3 h-3 text-current" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="p-6 border-t border-zinc-800 safe-area-bottom">
        <button
          onClick={() => onNavigate('club_select')}
          className="w-full bg-cyan-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 hover:bg-cyan-500"
        >
          Next <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default OnboardingBioScreen;