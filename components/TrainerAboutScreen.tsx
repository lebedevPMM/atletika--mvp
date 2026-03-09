import React, { useState } from 'react';
import { ScreenName } from '../types';
import {
    ArrowLeft,
    Copy,
    ChevronRight,
    FileText,
    Globe,
    Mail,
    Download,
    RefreshCw,
    Check,
    ShieldCheck,
    Smartphone,
    Code,
    Briefcase,
    Lock
} from 'lucide-react';

interface TrainerAboutScreenProps {
    onNavigate: (screen: ScreenName) => void;
}

const TrainerAboutScreen: React.FC<TrainerAboutScreenProps> = ({ onNavigate }) => {
    const [checkingUpdate, setCheckingUpdate] = useState(false);
    const [updateStatus, setUpdateStatus] = useState<'idle' | 'latest' | 'available'>('idle');
    const [copied, setCopied] = useState(false);

    // App Config
    const appInfo = {
        name: "Atletika+ Trainer",
        version: "1.0.0",
        build: "105",
        env: "Production"
    };

    // Technical Data for Support
    const debugInfo = {
        staff_id: "ST-4421",
        role: "trainer",
        app_version: `${appInfo.version} (${appInfo.build})`,
        os_version: "iOS 17.5",
        model: "iPhone 14",
        locale: "ru_RU",
        timezone: "Europe/Moscow",
        env: appInfo.env
    };

    const handleCheckUpdate = () => {
        setCheckingUpdate(true);
        // Simulate network request
        setTimeout(() => {
            setCheckingUpdate(false);
            setUpdateStatus('latest');
        }, 1500);
    };

    const handleCopyDebugInfo = () => {
        const textToCopy = JSON.stringify(debugInfo, null, 2);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            {/* Header */}
            <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
                <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </button>
                <h1 className="text-xl font-bold text-gray-900">О приложении</h1>
            </div>

            <div className="p-4 space-y-6 flex-1 overflow-y-auto pb-10">

                {/* 1. Version Block */}
                <div className="flex flex-col items-center pt-4 pb-2">
                    <div className="w-24 h-24 bg-gray-900 rounded-3xl flex items-center justify-center shadow-xl shadow-gray-300 mb-4 transform hover:scale-105 transition-transform">
                        <span className="text-4xl font-extrabold text-white tracking-tighter">A+</span>
                    </div>
                    <h2 className="text-2xl font-extrabold text-gray-900">{appInfo.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-medium text-gray-500">Версия {appInfo.version} ({appInfo.build})</span>
                        <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-mono uppercase font-bold">Staff</span>
                    </div>
                </div>

                {/* 2. Update Status */}
                <div className="bg-white rounded-2xl p-1 shadow-sm border border-gray-100">
                    {updateStatus === 'available' ? (
                        <div className="p-4 flex items-center justify-between">
                            <div>
                                <p className="font-bold text-gray-900">Доступно обновление</p>
                                <p className="text-xs text-gray-500">Критические исправления</p>
                            </div>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md">
                                Обновить
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleCheckUpdate}
                            disabled={checkingUpdate}
                            className="w-full p-4 flex items-center justify-center gap-2 text-sm font-medium text-blue-600 active:bg-blue-50 rounded-xl transition-colors"
                        >
                            {checkingUpdate ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" /> Проверка...
                                </>
                            ) : updateStatus === 'latest' ? (
                                <>
                                    <Check className="w-4 h-4" /> Актуальная версия
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4" /> Проверить обновления
                                </>
                            )}
                        </button>
                    )}
                </div>

                {/* 3. Internal Documents */}
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 ml-2">Внутренние документы</h3>
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 divide-y divide-gray-50">
                        {[
                            { title: 'Регламент работы', icon: Briefcase, action: 'docs' },
                            { title: 'Инструкция по ПДн', icon: Lock, action: 'docs' },
                            { title: 'Правила клуба', icon: FileText, action: 'docs' },
                        ].map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => onNavigate(item.action as ScreenName)}
                                className="w-full flex items-center justify-between p-4 active:bg-gray-50 transition-colors hover:bg-gray-50/50"
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className="w-5 h-5 text-gray-400" />
                                    <span className="text-sm font-medium text-gray-900">{item.title}</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-300" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* 4. Support Data (Technical Info) */}
                <div>
                    <div className="flex items-center justify-between mb-2 px-2">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Диагностика</h3>
                        <button
                            onClick={handleCopyDebugInfo}
                            className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg active:scale-95 transition-transform"
                        >
                            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            {copied ? 'Скопировано' : 'Скопировать'}
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="relative z-10 grid grid-cols-2 gap-y-3 gap-x-2">
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase">Staff ID</p>
                                <p className="text-xs font-mono font-bold text-gray-900">{debugInfo.staff_id}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase">Role</p>
                                <p className="text-xs font-mono font-medium text-gray-700">{debugInfo.role}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase">App Ver</p>
                                <p className="text-xs font-mono font-medium text-gray-700">{debugInfo.app_version}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase">Timezone</p>
                                <p className="text-xs font-mono font-medium text-gray-700 truncate">{debugInfo.timezone}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. Contact Channels */}
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 ml-2">Поддержка</h3>
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                        <button onClick={() => onNavigate('support')} className="w-full flex items-center justify-between p-4 border-b border-gray-50 active:bg-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                                    <Smartphone className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium text-gray-900">Связаться с IT</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-300" />
                        </button>
                    </div>
                </div>

            </div>

            <div className="p-6 text-center">
                <p className="text-[10px] text-gray-300">
                    © 2024 ООО «Атлетика Плюс». Служебное приложение.
                </p>
            </div>
        </div>
    );
};

export default TrainerAboutScreen;
