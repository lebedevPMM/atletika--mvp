
import React, { useState, useEffect } from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, CheckCircle2, Dumbbell, Clock, Play, SkipForward, Timer } from 'lucide-react';
import BrainBlinkGameScreen from './BrainBlink/BrainBlinkGameScreen';

interface WorkoutSessionProps {
    onNavigate: (screen: ScreenName) => void;
}

// Mock Workout Data
const MOCK_WORKOUT = {
    id: 'leg_day_1',
    title: 'Leg Destruction',
    exercises: [
        {
            id: 'ex1',
            name: 'Приседания со штангой',
            sets: 4,
            reps: '8-10',
            weight: 80,
            restSeconds: 30, // Short for testing, normally 90
            description: 'Спина прямая, глубина ниже параллели.'
        },
        {
            id: 'ex2',
            name: 'Румынская тяга',
            sets: 3,
            reps: '10-12',
            weight: 60,
            restSeconds: 60,
            description: 'Фокус на растяжении задней поверхности бедра.'
        },
        {
            id: 'ex3',
            name: 'Выпады с ходьбой',
            sets: 3,
            reps: '12 на ногу',
            weight: 20, // Dumbbells
            restSeconds: 45,
            description: 'Колено задней ноги не касается пола.'
        }
    ]
};

type SessionState = 'get_ready' | 'working' | 'resting' | 'finished';

export default function WorkoutSessionScreen({ onNavigate }: WorkoutSessionProps) {
    const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
    const [currentSet, setCurrentSet] = useState(1);
    const [sessionState, setSessionState] = useState<SessionState>('get_ready');
    const [restDuration, setRestDuration] = useState(60);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [getReadyTimer, setGetReadyTimer] = useState(5);

    const currentExercise = MOCK_WORKOUT.exercises[currentExerciseIdx];

    // Total session timer
    useEffect(() => {
        if (sessionState === 'get_ready') {
            const interval = setInterval(() => {
                setGetReadyTimer((t) => {
                    if (t <= 1) {
                        setSessionState('working');
                        return 0;
                    }
                    return t - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }

        if (sessionState === 'working' || sessionState === 'resting') {
            const interval = setInterval(() => setElapsedTime(t => t + 1), 1000);
            return () => clearInterval(interval);
        }
    }, [sessionState]);

    const handleFinishSet = () => {
        setRestDuration(currentExercise.restSeconds);
        setSessionState('resting');
    };

    const handleRestComplete = () => {
        setSessionState('working');

        // Advance logic
        if (currentSet < currentExercise.sets) {
            setCurrentSet(s => s + 1);
        } else {
            // Exercise complete
            if (currentExerciseIdx < MOCK_WORKOUT.exercises.length - 1) {
                setCurrentExerciseIdx(i => i + 1);
                setCurrentSet(1);
            } else {
                setSessionState('finished');
            }
        }
    };

    const handleSkipRest = () => {
        handleRestComplete();
    };

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (sessionState === 'get_ready') {
        return (
            <div className="flex flex-col h-screen bg-gray-50 dark:bg-zinc-950 items-center justify-center p-6 text-center text-white relative overflow-hidden transition-colors duration-300">
                {/* Pulse Circle Animation */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-96 h-96 bg-cyan-600/10 rounded-full animate-ping opacity-20"></div>
                </div>

                <h1 className="text-2xl font-black italic uppercase tracking-widest text-gray-400 dark:text-zinc-500 mb-8 animate-pulse">Приготовьтесь</h1>

                <div className="relative mb-12">
                    <div className="text-[150px] font-black italic leading-none text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-400 dark:from-white dark:to-zinc-500 tabular-nums animate-in zoom-in duration-300 key={getReadyTimer}">
                        {getReadyTimer}
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-3xl max-w-sm w-full mx-auto shadow-xl transition-colors">
                    <p className="text-gray-400 dark:text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Первое упражнение</p>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{currentExercise.name}</h2>
                    <p className="text-gray-500 dark:text-zinc-400 text-sm">{currentExercise.sets} подхода × {currentExercise.reps}</p>
                </div>
            </div>
        );
    }

    if (sessionState === 'finished') {
        return (
            <div className="flex flex-col h-screen bg-gray-50 dark:bg-zinc-950 items-center justify-center p-6 text-center text-white animate-in zoom-in duration-500 transition-colors duration-300">
                <div className="w-24 h-24 bg-green-100 dark:bg-green-500/10 rounded-full flex items-center justify-center mb-8 border border-green-200 dark:border-green-500/30 shadow-[0_0_50px_rgba(34,197,94,0.2)]">
                    <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-500" />
                </div>
                <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-4 text-gray-900 dark:text-white">Тренировка<br />Завершена</h1>
                <p className="text-gray-500 dark:text-zinc-400 mb-12 text-lg">Отличная работа. Вы тренировались <span className="text-gray-900 dark:text-white font-mono">{formatTime(elapsedTime)}</span>.</p>
                <button
                    onClick={() => onNavigate('home')}
                    className="w-full max-w-xs bg-cyan-600 text-white py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-cyan-500 hover:scale-105 transition-all shadow-lg shadow-cyan-500/20"
                >
                    Завершить
                </button>
            </div>
        );
    }

    if (sessionState === 'resting') {
        return (
            <div className="h-screen relative bg-gray-50 dark:bg-zinc-950 transition-colors duration-300">
                {/* Overlay Skip Button */}
                <button
                    onClick={handleSkipRest}
                    className="absolute top-6 right-6 z-50 bg-white/80 dark:bg-zinc-900/80 text-gray-900 dark:text-white px-6 py-3 rounded-full text-sm font-bold backdrop-blur-md flex items-center gap-2 border border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 active:scale-95 transition-all shadow-lg"
                >
                    <SkipForward className="w-4 h-4 fill-current" />
                    Пропустить
                </button>

                <BrainBlinkGameScreen
                    onNavigate={onNavigate}
                    mode="training"
                    initialDuration={restDuration}
                    title="Активное восстановление"
                    onComplete={handleRestComplete}
                />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-zinc-950 text-white relative overflow-hidden transition-colors duration-300">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-cyan-100/50 dark:from-cyan-950/20 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 p-4 flex items-center justify-between safe-area-top">
                <button onClick={() => onNavigate('BACK')} className="p-3 bg-white dark:bg-zinc-900 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors border border-gray-200 dark:border-zinc-800">
                    <ArrowLeft className="w-6 h-6 text-gray-900 dark:text-zinc-300" />
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-500 uppercase tracking-[0.2em]">Текущая тренировка</span>
                </div>
                <div className="w-12" />
            </div>

            {/* Main HUD */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">

                {/* Timer Block */}
                <div className="flex flex-col items-center mb-10">
                    <div className="text-[10px] uppercase font-bold text-gray-500 dark:text-zinc-600 mb-2 tracking-widest flex items-center gap-2">
                        <Timer className="w-3 h-3" /> Общее время
                    </div>
                    <div className="text-8xl font-mono font-bold tracking-tighter tabular-nums text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-gray-400 dark:from-white dark:to-zinc-600 drop-shadow-sm">
                        {formatTime(elapsedTime)}
                    </div>
                </div>

                {/* Exercise Info */}
                <div className="w-full max-w-sm">
                    <div className="flex justify-between items-end mb-4 px-2">
                        <span className="text-cyan-600 dark:text-cyan-500 font-bold tracking-widest text-xs uppercase">Упражнение {currentExerciseIdx + 1}/{MOCK_WORKOUT.exercises.length}</span>
                        <div className="flex gap-1">
                            {Array.from({ length: currentExercise.sets }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-8 h-1 rounded-full transition-all duration-500 ${i < currentSet ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-gray-300 dark:bg-zinc-800'}`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-gray-200 dark:border-zinc-800 p-6 rounded-[2rem] shadow-2xl relative overflow-hidden transition-colors">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>

                        <h2 className="text-3xl font-black leading-none mb-2 tracking-tight italic uppercase text-gray-900 dark:text-white">{currentExercise.name}</h2>
                        <p className="text-gray-500 dark:text-zinc-500 text-sm mb-8 leading-relaxed font-medium border-l-2 border-gray-200 dark:border-zinc-800 pl-3">{currentExercise.description}</p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-gray-50 dark:bg-zinc-950 rounded-2xl p-4 border border-gray-100 dark:border-zinc-800 flex flex-col items-center shadow-inner">
                                <span className="text-gray-400 dark:text-zinc-600 text-[9px] uppercase font-bold mb-1 tracking-wider">Вес</span>
                                <span className="text-3xl font-mono font-bold text-gray-900 dark:text-white">{currentExercise.weight}<span className="text-sm text-gray-500 dark:text-zinc-600 ml-1">кг</span></span>
                            </div>
                            <div className="bg-gray-50 dark:bg-zinc-950 rounded-2xl p-4 border border-gray-100 dark:border-zinc-800 flex flex-col items-center shadow-inner">
                                <span className="text-gray-400 dark:text-zinc-600 text-[9px] uppercase font-bold mb-1 tracking-wider">Повторы</span>
                                <span className="text-3xl font-mono font-bold text-gray-900 dark:text-white">{currentExercise.reps}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleFinishSet}
                            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-5 rounded-2xl font-bold text-lg uppercase tracking-wider shadow-[0_4px_20px_rgba(8,145,178,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                            <CheckCircle2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            Сделано {currentSet}
                        </button>
                    </div>
                    <p className="text-center text-xs text-gray-500 dark:text-zinc-600 mt-6 uppercase tracking-wider font-bold">Далее: {currentExercise.restSeconds}с Нейро-Дрилл</p>
                </div>
            </div>
        </div>
    );
}
