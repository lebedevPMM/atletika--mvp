
import { useState, useEffect } from 'react';
import { HomeData } from '../types';

export const useHomeData = () => {
    const [data, setData] = useState<HomeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [offline, setOffline] = useState(false);

    // Analytics helper - simplified for hook
    const logEvent = (name: string, params?: any) => {
        console.log(`[Analytics] ${name}`, params);
    };

    const fetchData = async () => {
        setLoading(true);
        setError(false);

        try {
            // MOCK DATA
            const mockData: HomeData = {
                clubName: 'Atletika+',
                clubLocation: 'Москва Сити',
                unreadNotifications: 3,
                userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
                tariff: {
                    isActive: true,
                    name: 'Безлимит Год',
                    expiryDate: '2026-12-31'
                },
                wallet: {
                    balance: 1200,
                    currency: '₽',
                    hasDebt: false
                },
                bonuses: {
                    amount: 350
                },
                services: {
                    total: 10,
                    left: 4,
                    name: 'Персональные'
                },
                nextBooking: {
                    id: 'booking_123',
                    title: 'Йога Flow',
                    subtitle: 'с Анной Морозовой • Зал 2',
                    time: '19:00',
                    date: 'Сегодня',
                    isConfirmed: true,
                    trainerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna'
                },
                promos: [
                    {
                        id: 1,
                        type: 'news',
                        title: 'Новые беговые дорожки Technogym',
                        subtitle: 'Обновление',
                        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600'
                    },
                    {
                        id: 2,
                        type: 'event',
                        title: 'Групповые тренировки: Расписание',
                        subtitle: 'Событие',
                        imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600'
                    }
                ],
                stories: [
                    { id: 1, title: 'Новости', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=200', isViewed: false },
                    { id: 2, title: 'Акции', imageUrl: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=200', isViewed: false },
                    { id: 3, title: 'Советы', imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=200', isViewed: true }
                ]
            };

            setData(mockData);
        } catch (e) {
            console.error(e);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { data, loading, error, offline, refetch: fetchData };
};
