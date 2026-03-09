import React, { useState, useEffect } from 'react';
import { ScreenName } from '../types';
import {
    ArrowLeft,
    FileText,
    Download,
    Trash2,
    Check,
    ChevronRight,
    Shield,
    Mail,
    Bell,
    AlertTriangle,
    Loader2,
    WifiOff
} from 'lucide-react';

interface PrivacyScreenProps {
    onNavigate: (screen: ScreenName) => void;
}

const PrivacyScreen: React.FC<PrivacyScreenProps> = ({ onNavigate }) => {
    const [isOffline, setIsOffline] = useState(false); // Mock offline state

    // Toggles
    const [marketingEmail, setMarketingEmail] = useState(true);
    const [marketingPush, setMarketingPush] = useState(true);

    // Export State
    const [exportStatus, setExportStatus] = useState<'idle' | 'pending' | 'ready'>('idle');

    // Delete State
    const [deleteStage, setDeleteStage] = useState<'idle' | 'confirming' | 'otp' | 'deleting'>('idle');
    const [deleteConfirmChecked, setDeleteConfirmChecked] = useState(false);
    const [deleteOtp, setDeleteOtp] = useState('');

    // Handlers
    const handleExportRequest = () => {
        if (isOffline) return;
        setExportStatus('pending');
        // Simulate API call
        setTimeout(() => {
            setExportStatus('ready');
        }, 2000);
    };

    const handleDeleteRequest = () => {
        if (isOffline) return;
        setDeleteStage('confirming');
    };

    const handleDeleteConfirm = () => {
        setDeleteStage('otp');
    };

    const handleDeleteFinal = () => {
        if (deleteOtp !== '0000') {
            alert('Неверный код (используйте 0000)');
            return;
        }
        setDeleteStage('deleting');
        setTimeout(() => {
            // Log out and reset
            onNavigate('auth_phone');
        }, 2000);
    };

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col relative">

            {/* Header */}
            <div className="bg-white px-4 py-3 shadow-sm flex items-center gap-4 sticky top-0 z-10 safe-area-top">
                <button
                    onClick={() => onNavigate('BACK')}
                    className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-gray-900" />
                </button>
                <h1 className="text-lg font-bold text-gray-900">Приватность и данные</h1>
            </div>

            {isOffline && (
                <div className="bg-gray-900 text-white px-4 py-3 flex items-center gap-3 text-sm font-bold">
                    <WifiOff className="w-4 h-4" />
                    <span className="opacity-90">Нет сети. Управление данными недоступно.</span>
                </div>
            )}

            <div className="p-4 space-y-6 flex-1 overflow-y-auto pb-24">

                {/* Consents Section */}
                <section>
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 ml-1">Мои согласия</h2>
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                        <div
                            onClick={() => onNavigate('auth_privacy')}
                            className="p-4 flex items-center justify-between border-b border-gray-100 cursor-pointer active:bg-gray-50"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                    <FileText className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">Обработка персональных данных</p>
                                    <p className="text-xs text-gray-400 mt-0.5">Принято 12.01.2024</p>
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="p-4 flex items-center justify-between cursor-pointer active:bg-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                    <Shield className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">Обработка данных здоровья</p>
                                    <p className="text-xs text-gray-400 mt-0.5">Принято 12.01.2024</p>
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                    </div>
                </section>

                {/* Communications Section */}
                <section>
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 ml-1">Коммуникации</h2>
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 divide-y divide-gray-100">
                        {/* Service Notifs (Fixed) */}
                        <div className="p-4 flex items-start justify-between">
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                    <Bell className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">Сервисные уведомления</p>
                                    <p className="text-xs text-gray-400 mt-0.5 max-w-[200px]">Статусы записей, оплат и важные изменения. Нельзя отключить.</p>
                                </div>
                            </div>
                            <div className="w-10 h-6 bg-blue-600 rounded-full opacity-50 relative pointer-events-none">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                            </div>
                        </div>

                        {/* Marketing Email */}
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex gap-3 items-center">
                                <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <p className="font-medium text-gray-900 text-sm">Новости и акции (Email)</p>
                            </div>
                            <button
                                onClick={() => setMarketingEmail(!marketingEmail)}
                                className={`w-10 h-6 rounded-full transition-colors relative ${marketingEmail ? 'bg-blue-600' : 'bg-gray-200'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${marketingEmail ? 'left-5' : 'left-1'}`}></div>
                            </button>
                        </div>

                        {/* Marketing Push */}
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex gap-3 items-center">
                                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                                    <Bell className="w-4 h-4" />
                                </div>
                                <p className="font-medium text-gray-900 text-sm">Акции (Push)</p>
                            </div>
                            <button
                                onClick={() => setMarketingPush(!marketingPush)}
                                className={`w-10 h-6 rounded-full transition-colors relative ${marketingPush ? 'bg-blue-600' : 'bg-gray-200'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${marketingPush ? 'left-5' : 'left-1'}`}></div>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Data Export Section */}
                <section>
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 ml-1">Экспорт данных</h2>
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                <Download className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm">Выгрузить копию данных</h3>
                                <p className="text-xs text-gray-500 mt-0.5">История посещений, оплат и профиль</p>
                            </div>
                        </div>

                        {exportStatus === 'ready' ? (
                            <div className="bg-green-50 text-green-700 text-sm p-3 rounded-xl flex items-center gap-2 mb-2 animate-in fade-in">
                                <Check className="w-4 h-4" />
                                Ссылка отправлена на email
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400 mb-4 bg-gray-50 p-3 rounded-xl border border-dashed border-gray-200">
                                Подготовка архива может занять до 24 часов. Ссылка на скачивание поступит на вашу подтвержденную почту.
                            </p>
                        )}

                        <button
                            onClick={handleExportRequest}
                            disabled={exportStatus !== 'idle' || isOffline}
                            className="w-full py-3 bg-white border border-gray-200 text-gray-900 rounded-xl font-bold text-sm hover:bg-gray-50 disabled:opacity-50 disabled:bg-gray-50 flex items-center justify-center gap-2"
                        >
                            {exportStatus === 'pending' && <Loader2 className="w-4 h-4 animate-spin" />}
                            {exportStatus === 'idle' ? 'Запросить архив' : exportStatus === 'pending' ? 'Обработка...' : 'Запросить повторно'}
                        </button>
                    </div>
                </section>

                {/* Delete Account Section */}
                <section>
                    <h2 className="text-xs font-bold text-red-400 uppercase tracking-wide mb-3 ml-1">Управление аккаунтом</h2>
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-red-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm">Удаление аккаунта</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Действие необратимо</p>
                            </div>
                        </div>

                        <button
                            onClick={handleDeleteRequest}
                            disabled={isOffline}
                            className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Удалить аккаунт
                        </button>
                    </div>
                </section>
            </div>

            {/* Delete Confirmation Modal */}
            {(deleteStage === 'confirming' || deleteStage === 'otp') && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-6 animate-in slide-in-from-bottom duration-300">
                        {deleteStage === 'confirming' && (
                            <>
                                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                                    <Trash2 className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Удалить аккаунт?</h3>
                                <div className="text-sm text-gray-500 mb-6 bg-red-50 p-4 rounded-xl border border-red-100">
                                    <ul className="list-disc pl-4 space-y-1">
                                        <li>Профиль и данные здоровья будут удалены</li>
                                        <li>История посещений и оплат будет обезличена</li>
                                        <li>Доступ в клубы будет заблокирован</li>
                                    </ul>
                                </div>
                                <label className="flex items-start gap-3 mb-6 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center mt-0.5 shrink-0 transition-colors ${deleteConfirmChecked ? 'bg-red-600 border-red-600' : 'border-gray-300 group-hover:border-red-400'}`}>
                                        {deleteConfirmChecked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                                    </div>
                                    <input type="checkbox" className="hidden" checked={deleteConfirmChecked} onChange={() => setDeleteConfirmChecked(!deleteConfirmChecked)} />
                                    <span className="text-sm text-gray-700">Я понимаю, что это действие нельзя отменить</span>
                                </label>
                                <div className="space-y-3">
                                    <button
                                        disabled={!deleteConfirmChecked}
                                        onClick={handleDeleteConfirm}
                                        className="w-full bg-red-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-red-200 disabled:opacity-50 disabled:shadow-none"
                                    >
                                        Продолжить
                                    </button>
                                    <button onClick={() => setDeleteStage('idle')} className="w-full py-3.5 text-gray-500 font-medium hover:bg-gray-50 rounded-xl">
                                        Отмена
                                    </button>
                                </div>
                            </>
                        )}

                        {deleteStage === 'otp' && (
                            <>
                                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Подтверждение</h3>
                                <p className="text-sm text-gray-500 text-center mb-6">Введите код из SMS для окончательного удаления. <br /> Тестовый код: <span className="font-mono text-gray-900">0000</span></p>

                                <input
                                    type="text"
                                    value={deleteOtp}
                                    onChange={(e) => setDeleteOtp(e.target.value)}
                                    className="w-full text-center text-3xl font-bold tracking-widest border-b-2 border-gray-300 py-2 mb-8 focus:outline-none focus:border-red-500"
                                    placeholder="0000"
                                    autoFocus
                                />

                                <button
                                    onClick={handleDeleteFinal}
                                    className="w-full bg-red-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-red-200 mb-3"
                                >
                                    Удалить навсегда
                                </button>
                                <button onClick={() => setDeleteStage('idle')} className="w-full py-3.5 text-gray-500 font-medium hover:bg-gray-50 rounded-xl">
                                    Отмена
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Global Deleting Overlay */}
            {deleteStage === 'deleting' && (
                <div className="fixed inset-0 z-[60] bg-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
                    <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
                    <h2 className="text-xl font-bold text-gray-900">Удаляем данные...</h2>
                    <p className="text-gray-500 mt-2">Приложение закроется автоматически.</p>
                </div>
            )}

        </div>
    );
};

export default PrivacyScreen;
