import { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { OTPInput } from '@/shared/ui/OTPInput';
import { authApi } from '@/features/auth/api';
import { useAuthStore } from '@/features/auth/store';
import { useClubStore } from '@/features/club/store';
import { useScreenView } from '@/features/analytics/tracker';
import { useHaptic } from '@/shared/hooks/useHaptic';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { SPACING } from '@/shared/theme/types';

const RESEND_INTERVAL = 120; // seconds

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function OtpScreen() {
  useScreenView('client_otp');

  const router = useRouter();
  const { phone, requestId: initialRequestId } = useLocalSearchParams<{
    phone: string;
    requestId: string;
  }>();
  const { colors } = useTheme();
  const styles = useStyles();
  const haptic = useHaptic();

  const [requestId, setRequestId] = useState(initialRequestId ?? '');
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(RESEND_INTERVAL);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Countdown timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [requestId]); // restart timer on new requestId (resend)

  const handleResend = useCallback(async () => {
    if (countdown > 0 || !phone) return;
    try {
      const response = await authApi.requestOtp(phone);
      setRequestId(response.requestId);
      setCountdown(RESEND_INTERVAL);
      setError(null);
    } catch {
      setError('Не удалось отправить код повторно');
    }
  }, [countdown, phone]);

  const handleComplete = useCallback(
    async (code: string) => {
      if (!phone || !requestId) return;
      setError(null);
      setVerifying(true);

      try {
        const response = await authApi.verifyOtp(phone, code, requestId);

        // Store auth data
        await useAuthStore.getState().setAuth(
          response.accessToken,
          response.refreshToken,
          response.user,
        );

        // Auto-select first club
        if (response.clubs.length > 0) {
          const club = response.clubs[0];
          useClubStore.getState().setClub(
            club.id,
            club.branchId ?? '',
            club.name,
          );
        }

        // Navigate based on response flags
        if (response.firstLogin || response.docsUpdated) {
          router.replace('/(auth)/offer' as never);
        } else if (response.user.role === 'trainer') {
          // Trainers skip club-loading and go directly to trainer home
          router.replace('/(trainer)/(home)');
        } else {
          router.replace('/(auth)/club-loading');
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Неверный код';
        setError(message);
        haptic.error();
      } finally {
        setVerifying(false);
      }
    },
    [phone, requestId, router, haptic],
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        {/* Back button */}
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>{'\u2190'}</Text>
        </Pressable>

        <View style={styles.center}>
          <Text style={styles.title}>Введите код</Text>
          <Text style={styles.subtitle}>
            Код отправлен на {phone ?? ''}
          </Text>

          <View style={styles.otpWrap}>
            <OTPInput
              onComplete={handleComplete}
              error={!!error}
            />
          </View>

          {error && <Text style={styles.error}>{error}</Text>}

          {verifying && (
            <Text style={styles.verifying}>Проверка...</Text>
          )}

          {/* Resend */}
          <View style={styles.resendWrap}>
            {countdown > 0 ? (
              <Text style={styles.timer}>
                Повторный код через {formatTimer(countdown)}
              </Text>
            ) : (
              <Pressable onPress={handleResend}>
                <Text style={styles.resendLink}>Отправить повторно</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const useStyles = createStyles((t) => ({
  safe: {
    flex: 1,
    backgroundColor: t.colors.bg.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING[4],
  },
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginTop: SPACING[2],
  },
  backIcon: {
    fontSize: 24,
    color: t.colors.text.primary,
  },
  center: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  title: {
    ...t.typography.h1,
    color: t.colors.text.primary,
    marginBottom: SPACING[2],
  },
  subtitle: {
    ...t.typography.body,
    color: t.colors.text.secondary,
    marginBottom: SPACING[8],
    textAlign: 'center' as const,
  },
  otpWrap: {
    marginBottom: SPACING[4],
  },
  error: {
    ...t.typography.bodySm,
    color: t.colors.semantic.error.main,
    marginTop: SPACING[2],
    textAlign: 'center' as const,
  },
  verifying: {
    ...t.typography.bodySm,
    color: t.colors.text.secondary,
    marginTop: SPACING[2],
  },
  resendWrap: {
    marginTop: SPACING[8],
    alignItems: 'center' as const,
  },
  timer: {
    ...t.typography.bodySm,
    color: t.colors.text.tertiary,
  },
  resendLink: {
    ...t.typography.bodySm,
    color: t.colors.accent.primary,
  },
}));
