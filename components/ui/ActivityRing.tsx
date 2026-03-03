import React from 'react';
import { motion } from 'framer-motion';

interface ActivityRingProps {
    progress: number; // 0 to 100
    size?: number;
    strokeWidth?: number;
    color?: string; // hex color
    icon?: React.ReactNode;
    label?: string;
    value?: string;
}

export const ActivityRing: React.FC<ActivityRingProps> = ({
    progress,
    size = 120,
    strokeWidth = 8,
    color = '#D2FF00',
    icon,
    label,
    value
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            {/* Background Circle */}
            <svg width={size} height={size} className="transform -rotate-90 text-white/10">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                {/* Progress Circle (Glow Layer) */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{
                        filter: `drop-shadow(0 0 4px ${color})`
                    }}
                    className="opacity-50"
                />
                {/* Progress Circle (Main Layer) */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />
            </svg>

            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                {icon && <div className="mb-1 text-white/80">{icon}</div>}
                {value && <div className="text-xl font-bold font-display tracking-tighter tabular-nums">{value}</div>}
                {label && <div className="text-[10px] uppercase font-mono text-white/40">{label}</div>}
            </div>
        </div>
    );
};
