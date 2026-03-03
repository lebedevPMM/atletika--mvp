import React, { useState } from 'react';
import { ScreenName } from '../types';
import {
    ArrowLeft,
    MapPin,
    User,
    Calendar,
    Clock,
    CreditCard,
    XCircle,
    CheckCircle2,
    AlertCircle,
    Phone,
    Navigation
} from 'lucide-react';

interface MyBookingDetailsScreenProps {
    onNavigate: (screen: ScreenName) => void;
}

type BookingStatus = 'confirmed' | 'pending_payment' | 'pending_confirm' | 'canceled' | 'paid';

const MyBookingDetailsScreen: React.FC<MyBookingDetailsScreenProps> = ({ onNavigate }) => {
    // DEV: Toggle status to test different views
    const [status, setStatus] = useState<BookingStatus>('confirmed');
    const [isCancelling, setIsCancelling] = useState(false);

    const booking = {
        id: 'b-777',
        title: 'Персональная тренировка',
        type: 'pt',
        date: '15 Сен 2024',
        startTime: '10:00',
        endTime: '11:00',
        duration: '60 мин',
        location: 'Атлетика+ Сити',
        address: 'ул. Ленина, 25, 3 этаж',
        room: 'Тренажерный зал',
        trainer: {
            id: 102,
            name: 'Иван Козлов',
            role: 'Топ-тренер',
            img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan'
        },
        price: 2500,
        invoiceId: 'inv-888',
        cancelWindow: '24 часа', // Text description
        canCancel: true,
        notes: 'Взять с собой полотенце и воду.'
    };

    const handleCancel = () => {
        // Simulate API cancel
        setIsCancelling(true);
        setTimeout(() => {
            setStatus('canceled');
            setIsCancelling(false);
        }, 1500);
    };

    const handlePay = () => {
        onNavigate('payment_methods');
    };

    const getStatusBadge = (s: BookingStatus) => {
        switch (s) {
            case 'confirmed':
                return <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Подтверждено</span>;
            case 'paid':
                return <span className="text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Оплачено</span>;
            case 'pending_payment':
                return <span className="text-xs font-bold bg-orange-100 text-orange-700 px-3 py-1 rounded-full flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Ожидает оплаты</span>;
            case 'pending_confirm':
                return <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">Ожидает подтверждения</span>;
            case 'canceled':
                return <span className="text-xs font-bold bg-red-100 text-red-700 px-3 py-1 rounded-full">Отменено</span>;
            default:
                return null;
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            {/* Header */}
            <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
                <button onClick={() => onNavigate('my_schedule')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </button>
                <div className="flex-1">
                    <h1 className="text-lg font-bold text-gray-900 leading-tight">{booking.title}</h1>
                    <p className="text-xs text-gray-500">Заказ #{booking.id}</p>
                </div>

                {/* DEV: Status Toggler */}
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as BookingStatus)}
                    className="text-[10px] bg-gray-100 border-none rounded p-1"
                >
                    <option value="confirmed">Confirmed</option>
                    <option value="pending_payment">Payment Needed</option>
                    <option value="paid">Paid</option>
                    <option value="canceled">Canceled</option>
                </select>
            </div>

            <div className="flex-1 overflow-y-auto pb-24 p-4 space-y-4">

                {/* Status Banner (if needed) */}
                {status === 'pending_payment' && (
                    <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-sm font-bold text-orange-900">Необходимо оплатить заказ</h3>
                            <p className="text-xs text-orange-800 mt-1">
                                Бронь будет отменена автоматически через 30 минут, если оплата не поступит.
                            </p>
                        </div>
                    </div>
                )}

                {/* Status Line */}
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 font-medium">Статус</span>
                    {getStatusBadge(status)}
                </div>

                {/* Main Info Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-50">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">{booking.date}</p>
                                <p className="text-xs text-gray-500">{booking.startTime} - {booking.endTime} ({booking.duration})</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-500">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-gray-900">{booking.location}</p>
                                <p className="text-xs text-gray-500">{booking.address}</p>
                            </div>
                            <button className="p-2 bg-gray-100 rounded-lg text-gray-600">
                                <Navigation className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50/50">
                        <div className="flex items-center gap-3">
                            <img src={booking.trainer.img} alt={booking.trainer.name} className="w-10 h-10 rounded-full object-cover" />
                            <div className="flex-1">
                                <p className="text-sm font-bold text-gray-900">{booking.trainer.name}</p>
                                <p className="text-xs text-gray-500">{booking.trainer.role}</p>
                            </div>
                            <button onClick={() => onNavigate('trainer_about')} className="text-xs font-bold text-blue-600">
                                Профиль
                            </button>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-900 mb-2">Важная информация</h3>
                    <p className="text-xs text-gray-600 leading-relaxed bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                        {booking.notes}
                    </p>
                </div>

                {/* Cancellation Policy */}
                {status !== 'canceled' && (
                    <div className="text-center px-4">
                        <p className="text-[10px] text-gray-400">
                            Бесплатная отмена возможна за {booking.cancelWindow} до начала занятия.
                            <br />
                            При поздней отмене может взиматься штраф.
                        </p>
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="bg-white p-4 border-t border-gray-100 safe-area-bottom space-y-3">
                {status === 'pending_payment' && (
                    <button
                        onClick={handlePay}
                        className="w-full bg-black text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                    >
                        <CreditCard className="w-5 h-5" />
                        Оплатить {booking.price} ₽
                    </button>
                )}

                {(status === 'confirmed' || status === 'paid') && (
                    <div className="flex gap-3">
                        <button
                            onClick={() => onNavigate('booking_reschedule')}
                            className="flex-1 bg-gray-100 text-gray-900 py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                        >
                            Перенести
                        </button>
                        <button
                            onClick={handleCancel}
                            disabled={isCancelling}
                            className="flex-1 bg-red-50 text-red-600 py-4 rounded-xl font-bold hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isCancelling ? 'Отмена...' : 'Отменить'}
                        </button>
                    </div>
                )}

                {status === 'canceled' && (
                    <button
                        onClick={() => onNavigate('booking_pt_calendar')}
                        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200"
                    >
                        Записаться снова
                    </button>
                )}

                {/* Secondary Contact Action */}
                <button className="w-full py-2 text-xs font-bold text-gray-400 flex items-center justify-center gap-1">
                    <Phone className="w-3 h-3" />
                    Связаться с администратором
                </button>
            </div>
        </div>
    );
};

export default MyBookingDetailsScreen;
