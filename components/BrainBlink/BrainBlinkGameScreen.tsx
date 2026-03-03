import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ScreenName } from '../../types';
import { ArrowLeft, Play, RotateCcw, Zap, Trophy, Volume2, VolumeX } from 'lucide-react';

interface BrainBlinkProps {
    onNavigate: (screen: ScreenName) => void;
    mode?: 'casual' | 'training';
    initialDuration?: number; // Seconds
    onComplete?: (score: number) => void;
    title?: string;
}

// Configuration
const GRID_SIZE = 9; // 3x3
const DEFAULT_DURATION = 60; // seconds

type GameMode = 'Memory' | 'Speed' | 'Pattern' | 'Color';
type GameState = 'menu' | 'countdown' | 'playing' | 'gameover';
type Phase = 'memorize' | 'recall';

export default function BrainBlinkGameScreen({
    onNavigate,
    mode = 'casual',
    initialDuration = DEFAULT_DURATION,
    onComplete,
    title = "Memory Recall"
}: BrainBlinkProps) {
    // --- STATE ---
    const [gameState, setGameState] = useState<GameState>(mode === 'training' ? 'playing' : 'menu');
    const [selectedMode, setSelectedMode] = useState<GameMode>('Memory');
    const [timeLeft, setTimeLeft] = useState(initialDuration);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(() => {
        if (typeof window !== 'undefined') {
            return parseInt(localStorage.getItem('brainblink_highscore') || '0');
        }
        return 0;
    });

    const [sequence, setSequence] = useState<number[]>([]);
    const [pattern, setPattern] = useState<number[]>([]); // For Pattern mode
    const [targetColor, setTargetColor] = useState<string>(''); // For Color mode
    const [cellColors, setCellColors] = useState<string[]>([]); // For Color mode
    const [playerStep, setPlayerStep] = useState(0);
    const [phase, setPhase] = useState<Phase>('memorize');
    const [activeCell, setActiveCell] = useState<number | null>(null); // Cell strictly lit up by game
    const [activeCells, setActiveCells] = useState<number[]>([]); // Multiple cells for Pattern mode
    const [pressedCell, setPressedCell] = useState<number | null>(null); // Cell pressed by user
    const [isSoundEnabled, setIsSoundEnabled] = useState(true);
    const [ghost, setGhost] = useState<{ name: string, targetScore: number } | null>(null);

    // Refs
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const sequenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // --- AUDIO & HAPTICS ---
    const triggerHaptic = (type: 'light' | 'heavy' | 'error') => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            switch (type) {
                case 'light': navigator.vibrate(10); break;
                case 'heavy': navigator.vibrate(30); break;
                case 'error': navigator.vibrate([50, 50, 50, 50]); break;
            }
        }
    };

    const playSound = useCallback((type: 'tap' | 'start' | 'error' | 'success') => {
        if (!isSoundEnabled) return;
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            const now = ctx.currentTime;

            switch (type) {
                case 'tap':
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(440, now);
                    osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
                    gain.gain.setValueAtTime(0.1, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                    osc.start(now);
                    osc.stop(now + 0.1);
                    break;
                case 'success':
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(500, now);
                    osc.frequency.linearRampToValueAtTime(1000, now + 0.1);
                    gain.gain.setValueAtTime(0.1, now);
                    gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
                    osc.start(now);
                    osc.stop(now + 0.2);
                    break;
                case 'error':
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(150, now);
                    osc.frequency.linearRampToValueAtTime(100, now + 0.3);
                    gain.gain.setValueAtTime(0.2, now);
                    gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
                    osc.start(now);
                    osc.stop(now + 0.3);
                    break;
                case 'start':
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(440, now);
                    gain.gain.setValueAtTime(0.1, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
                    osc.start(now);
                    osc.stop(now + 0.5);
                    break;
            }
        } catch (e) {
            console.error("Audio playback error", e);
        }
    }, [isSoundEnabled]);

    // --- GAME LOOP ---

    const playSequence = useCallback(async (seq: number[]) => {
        try {
            for (let i = 0; i < seq.length; i++) {
                await new Promise(r => setTimeout(r, 400)); // Gap
                const cell = seq[i];
                setActiveCell(cell);
                playSound('tap');
                triggerHaptic('light');

                await new Promise(r => setTimeout(r, 400)); // Lit duration
                setActiveCell(null);
            }
        } catch (e) {
            console.error("Sequence error", e);
        } finally {
            setPhase('recall');
        }
    }, [isSoundEnabled, playSound]);

    // --- GAME LOGIC HANDLERS ---

    const startSpeedMode = () => {
        const next = Math.floor(Math.random() * GRID_SIZE);
        setActiveCell(next);
        setPhase('recall'); // Speed mode is always "recall" (reaction)
    };

    const startPatternMode = (level: number) => {
        setPhase('memorize');
        // Level 1 = 3 cells, Level 2 = 4 cells...
        const count = 3 + Math.floor(level / 2);
        const newPattern: number[] = [];
        while (newPattern.length < count) {
            const r = Math.floor(Math.random() * GRID_SIZE);
            if (!newPattern.includes(r)) newPattern.push(r);
        }
        setPattern(newPattern);
        setActiveCells(newPattern);

        setTimeout(() => {
            setActiveCells([]);
            setPhase('recall');
            setPlayerStep(0); // Track how many correct found
        }, 1000 + (level * 200));
    };

    const startColorMode = () => {
        // Colors: Red, Green, Blue, Yellow
        const colors = ['#ef4444', '#22c55e', '#3b82f6', '#eab308'];
        const colorNames = ['RED', 'GREEN', 'BLUE', 'YELLOW'];

        const correctIndex = Math.floor(Math.random() * 4);
        setTargetColor(colorNames[correctIndex]); // "TAP RED"

        // Assign random colors to grid
        const gridColors = Array.from({ length: GRID_SIZE }, () => colors[Math.floor(Math.random() * colors.length)]);
        // Ensure at least one is correct ink
        const correctInk = colors[correctIndex];
        const randomCell = Math.floor(Math.random() * GRID_SIZE);
        gridColors[randomCell] = correctInk;

        setCellColors(gridColors);
        setPhase('recall');
    };

    const nextRound = useCallback((currentSeq: number[]) => {
        if (selectedMode === 'Speed') {
            startSpeedMode();
        } else if (selectedMode === 'Pattern') {
            startPatternMode(currentSeq.length); // Use seq length as level counter
        } else if (selectedMode === 'Color') {
            startColorMode();
        } else {
            // Memory (Default)
            setPhase('memorize');
            setPlayerStep(0);

            const nextItem = Math.floor(Math.random() * GRID_SIZE);
            const newSeq = [...currentSeq, nextItem];
            setSequence(newSeq);
            playSequence(newSeq);
        }
    }, [selectedMode, playSequence]);

    const endGame = useCallback(() => {
        setGameState('gameover');
        playSound('error');
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('brainblink_highscore', score.toString());
        }
        triggerHaptic('error');
        if (onComplete) {
            // Slight delay to show Game Over screen briefly or handled by callback
            setTimeout(() => onComplete(score), 2000);
        }
    }, [score, highScore, onComplete]);

    const startGame = useCallback(() => {
        setGameState('playing');
        setTimeLeft(initialDuration);
        setScore(0);
        setSequence([]);
        setPattern([]); // Reset pattern
        setPlayerStep(0);
        setPhase('memorize');

        // Simulate Ghost Matchmaking
        const mockGhosts = [
            { name: "CyberRonin", score: 2400 },
            { name: "NeuralLinker", score: 3100 },
            { name: "BrainHacker", score: 1800 },
        ];

        // Use ghost in both modes
        setGhost({
            name: mockGhosts[Math.floor(Math.random() * mockGhosts.length)].name,
            targetScore: mockGhosts[Math.floor(Math.random() * mockGhosts.length)].score
        });

        // Start first round
        setTimeout(() => nextRound([]), 500);
        playSound('start');
    }, [initialDuration, nextRound, playSound]);

    // Timer Countdown
    useEffect(() => {
        if (gameState === 'playing' && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        // We rely on effect below to trigger endGame to solve closure staleness
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else if (timeLeft === 0 && gameState === 'playing') {
            endGame();
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [gameState, timeLeft, endGame]);

    // Auto-start for training mode
    const hasStartedRef = useRef(false);
    useEffect(() => {
        if (mode === 'training' && !hasStartedRef.current) {
            hasStartedRef.current = true;
            startGame();
        }
    }, [mode, startGame]);


    const handleCellPress = (index: number) => {
        if (gameState !== 'playing' || phase !== 'recall') return;

        setPressedCell(index);
        triggerHaptic('light');
        playSound('tap');

        setTimeout(() => setPressedCell(null), 150);

        if (selectedMode === 'Speed') {
            if (index === activeCell) {
                setScore(s => s + 50);
                playSound('success');
                startSpeedMode(); // Immediately next
            } else {
                setScore(s => Math.max(0, s - 20));
                triggerHaptic('error');
                playSound('error');
            }
        } else if (selectedMode === 'Pattern') {
            // Check if cell is part of pattern
            if (pattern.includes(index)) {
                // Check if already found? simplified: just count clicks
                // Better: remove from temp set?
                // Simple implementation:
                const newStep = playerStep + 1;
                setPlayerStep(newStep);
                if (newStep === pattern.length) {
                    setScore(s => s + (pattern.length * 20));
                    playSound('success');
                    triggerHaptic('heavy');
                    setTimeout(() => nextRound(Array(pattern.length + 1).fill(0)), 800); // Hack to inc level
                }
            } else {
                triggerHaptic('error');
                playSound('error');
                setTimeLeft(t => Math.max(0, t - 5));
                endGame();
            }
        } else if (selectedMode === 'Color') {
            const tappedColor = cellColors[index];
            const targetInk = targetColor === 'RED' ? '#ef4444' :
                targetColor === 'GREEN' ? '#22c55e' :
                    targetColor === 'BLUE' ? '#3b82f6' : '#eab308';

            if (tappedColor === targetInk) {
                setScore(s => s + 100);
                playSound('success');
                setTimeout(() => startColorMode(), 500);
            } else {
                triggerHaptic('error');
                playSound('error');
                setTimeLeft(t => Math.max(0, t - 5));
            }
        } else {
            // Memory (Original)
            if (index === sequence[playerStep]) {
                const nextStep = playerStep + 1;
                setPlayerStep(nextStep);

                if (nextStep === sequence.length) {
                    setScore(s => s + (sequence.length * 10));
                    playSound('success');
                    triggerHaptic('heavy');
                    setTimeout(() => nextRound(sequence), 800);
                }
            } else {
                triggerHaptic('error');
                playSound('error');
                setTimeLeft(t => Math.max(0, t - 5));
                endGame();
            }
        }
    };

    // --- RENDER HELPERS ---
    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col h-full bg-zinc-950 text-cyan-400 font-mono relative overflow-hidden select-none">

            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 to-zinc-950 pointer-events-none" />
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(#00ffff 1px, transparent 1px), linear-gradient(90deg, #00ffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            />

            {/* Header (Only show in casual mode or if requested) */}
            {mode === 'casual' && (
                <div className="relative z-10 flex justify-between items-center p-4 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm">
                    <button
                        onClick={() => onNavigate('BACK')}
                        className="p-2 rounded-full hover:bg-zinc-800 transition-colors text-zinc-400"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="flex flex-col items-center">
                        <h1 className="text-xl font-bold tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 pixel-font">
                            BrainBlink
                        </h1>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{title}</span>
                    </div>
                    <button
                        onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                        className="p-2 rounded-full hover:bg-zinc-800 transition-colors text-zinc-400"
                    >
                        {isSoundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    </button>
                </div>
            )}

            {/* Main Content */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 gap-8">

                {/* HUD */}
                <div className="flex justify-between w-full max-w-sm px-4">
                    <div className={`flex flex-col items-start ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-cyan-400'}`}>
                        <span className="text-xs uppercase text-zinc-500 mb-1">Time</span>
                        <span className="text-3xl font-mono font-bold">{formatTime(timeLeft)}</span>
                    </div>
                    <div className="flex flex-col items-end text-purple-400">
                        <span className="text-xs uppercase text-zinc-500 mb-1">Score</span>
                        <span className="text-3xl font-mono font-bold animate-tick">{score.toString().padStart(4, '0')}</span>
                    </div>
                </div>

                {/* GAME GRID */}
                {!['menu', 'gameover'].includes(gameState) && (
                    <>
                        {/* Ghost Bar */}
                        {ghost && (
                            <div className="w-full max-w-xs -mt-4 mb-2">
                                <div className="flex justify-between text-[10px] text-zinc-500 mb-1 uppercase tracking-wider">
                                    <span>You</span>
                                    <span>{ghost.name}</span>
                                </div>
                                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden relative">
                                    {/* Ghost position (approximate linear progress) */}
                                    <div
                                        className="absolute top-0 bottom-0 bg-purple-500/50 w-1 transition-all duration-1000"
                                        style={{ left: `${Math.min(100, (ghost.targetScore * ((initialDuration - timeLeft) / initialDuration) / (ghost.targetScore * 1.2)) * 100)}%` }}
                                    />
                                    {/* Player position */}
                                    <div
                                        className="absolute top-0 bottom-0 bg-cyan-400 w-full transition-all duration-300 origin-left"
                                        style={{ transform: `scaleX(${Math.min(1, score / (ghost.targetScore * 1.2))})` }}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-3 gap-3 w-full max-w-xs aspect-square p-3 bg-zinc-900/50 rounded-2xl border border-zinc-800 shadow-2xl relative">
                            {/* Phase Indicator */}
                            {/* Phase Indicator */}
                            <div className={`absolute -top-10 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full border ${phase === 'memorize' ? 'border-yellow-500 text-yellow-500 bg-yellow-950/30' : 'border-green-500 text-green-500 bg-green-950/30'}`}>
                                {selectedMode === 'Color' ? (targetColor ? `TAP ${targetColor}` : 'MATCH') : (phase === 'memorize' ? 'WATCH' : 'REPEAT')}
                            </div>

                            {Array.from({ length: GRID_SIZE }).map((_, idx) => {
                                const isActive = activeCell === idx || activeCells.includes(idx);
                                const isPressed = pressedCell === idx;

                                // Color Mode Logic
                                let cellColor = '';
                                let activeStyles = 'bg-cyan-500 border-cyan-300 shadow-[0_0_20px_#00ffff] scale-95 z-20 brightness-110';

                                if (selectedMode === 'Color' && cellColors[idx]) {
                                    const c = cellColors[idx];
                                    // Base color styles
                                    if (c === '#ef4444') cellColor = 'bg-red-900/40 border-red-900';
                                    else if (c === '#22c55e') cellColor = 'bg-green-900/40 border-green-900';
                                    else if (c === '#3b82f6') cellColor = 'bg-blue-900/40 border-blue-900';
                                    else if (c === '#eab308') cellColor = 'bg-yellow-900/40 border-yellow-900';

                                    // Override visual logic for Color mode
                                    activeStyles = '';
                                }

                                return (
                                    <button
                                        key={idx}
                                        onMouseDown={() => handleCellPress(idx)}
                                        onTouchStart={() => handleCellPress(idx)}
                                        // disabled={phase === 'memorize'} // Block input during demo -> NOT strictly true for Speed/Color modes
                                        className={`
                                            relative rounded-xl transition-all duration-75 border-2 flex items-center justify-center
                                            ${isActive || isPressed
                                                ? activeStyles
                                                : selectedMode === 'Color' ? cellColor : 'bg-zinc-800 border-zinc-700 hover:border-zinc-600 shadow-none scale-100 z-10'
                                            }
                                            cursor-pointer active:scale-95
                                        `}
                                        style={selectedMode === 'Color' ? {
                                            backgroundColor: cellColors[idx],
                                            borderColor: 'rgba(255,255,255,0.2)',
                                            boxShadow: isPressed ? 'none' : `0 0 15px ${cellColors[idx]}40`
                                        } : {}}
                                    >
                                        {(isActive || isPressed) && selectedMode !== 'Color' && (
                                            <div className={`absolute inset-2 rounded-lg border border-white/10 bg-white/20`} />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </>
                )}

                {/* MENU STATE */}
                {gameState === 'menu' && (
                    <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-300 text-center">
                        <div className="w-24 h-24 rounded-full bg-zinc-900 border-2 border-cyan-500 shadow-[0_0_30px_rgba(34,211,238,0.3)] flex items-center justify-center mb-4">
                            <Zap className="w-10 h-10 text-cyan-400" />
                        </div>
                        <div className="flex flex-col items-center">
                            <h2 className="text-2xl font-bold text-white mb-2">Ready to Focus?</h2>
                            <p className="text-zinc-400 text-sm max-w-[240px] h-12">
                                {selectedMode === 'Memory' && "Watch the sequence. Repeat it exactly. It gets longer every round."}
                                {selectedMode === 'Speed' && "Reflex test. Tap the lit tiles as fast as you can. Don't miss!"}
                                {selectedMode === 'Pattern' && "Spatial recall. Memorize the pattern of locations, then tap them all."}
                                {selectedMode === 'Color' && "Stroop test. Read the command (e.g. 'TAP RED') and tap the matching color."}
                            </p>
                        </div>
                        <div className="flex gap-2 bg-zinc-900 p-1 rounded-full mb-2">
                            {(['Memory', 'Speed', 'Pattern', 'Color'] as GameMode[]).map(m => (
                                <button
                                    key={m}
                                    onClick={() => setSelectedMode(m)}
                                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition-all ${selectedMode === m ? 'bg-zinc-800 text-cyan-400 shadow-sm border border-zinc-700' : 'text-zinc-600 hover:text-zinc-400'}`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => startGame()}
                            className="mt-4 flex items-center gap-3 bg-cyan-500 hover:bg-cyan-400 text-black px-8 py-4 rounded-full font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(34,211,238,0.5)]"
                        >
                            <Play className="w-5 h-5 fill-current" />
                            Start Session
                        </button>
                        {highScore > 0 && (
                            <div className="mt-8 flex items-center gap-2 text-yellow-500 text-sm font-mono border border-yellow-500/30 px-4 py-2 rounded-lg bg-yellow-500/10">
                                <Trophy className="w-4 h-4" />
                                High Score: {highScore}
                            </div>
                        )}
                    </div>
                )}

                {/* GAME OVER STATE */}
                {gameState === 'gameover' && (
                    <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-300 text-center z-50">
                        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400 tracking-tighter">
                            SESSION<br />COMPLETE
                        </h2>

                        <div className="grid grid-cols-2 gap-4 w-full cursor-default">
                            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                                <p className="text-xs text-zinc-500 uppercase">Score</p>
                                <p className="text-2xl font-bold text-white">{score}</p>
                            </div>
                            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                                <p className="text-xs text-zinc-500 uppercase">Best</p>
                                <p className="text-2xl font-bold text-yellow-500">{highScore}</p>
                            </div>
                        </div>

                        {mode === 'casual' ? (
                            <button
                                onClick={() => startGame()}
                                className="mt-6 flex items-center gap-3 bg-white hover:bg-gray-200 text-black px-8 py-4 rounded-full font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-xl"
                            >
                                <RotateCcw className="w-5 h-5" />
                                Retry
                            </button>
                        ) : (
                            <p className="text-zinc-500 mt-4 animate-pulse">Rest complete. Returning...</p>
                        )}
                    </div>
                )}

            </div>
        </div >
    );
}


