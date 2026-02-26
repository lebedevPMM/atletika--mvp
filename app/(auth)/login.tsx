import { useState, useCallback } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '@/shared/ui';
import { PhoneInput } from '@/shared/ui/PhoneInput';
import { authApi } from '@/features/auth/api';
import { useScreenView } from '@/features/analytics/tracker';
import { createStyles } from '@/shared/theme/createStyles';
import { SPACING } from '@/shared/theme/types';

export default function LoginScreen() {
  useScreenView('client_login');

  const router = useRouter();
  const styles = useStyles();

  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = phone.length === 10 && !loading;

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;
    setError(null);
    setLoading(true);

    try {
      const fullPhone = `+7${phone}`;
      const response = await authApi.requestOtp(fullPhone);
      router.push({
        pathname: '/(auth)/otp',
        params: { phone: fullPhone, requestId: response.requestId },
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Не удалось отправить код';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [canSubmit, phone, router]);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.logo}>Atletika+</Text>
            <Text style={styles.title}>Вход</Text>
            <Text style={styles.subtitle}>Введите номер телефона</Text>
          </View>

          <View style={styles.form}>
            <PhoneInput
              value={phone}
              onChangeText={setPhone}
              error={error ?? undefined}
              autoFocus
            />
            <Button
              title="Получить код"
              onPress={handleSubmit}
              loading={loading}
              disabled={!canSubmit}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const useStyles = createStyles((t) => ({
  safe: {
    flex: 1,
    backgroundColor: t.colors.bg.primary,
  },
  flex: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: 'center' as const,
    paddingHorizontal: SPACING[4],
  },
  header: {
    alignItems: 'center' as const,
    marginBottom: SPACING[8],
  },
  logo: {
    ...t.typography.display,
    color: t.colors.accent.primary,
    marginBottom: SPACING[6],
  },
  title: {
    ...t.typography.h1,
    color: t.colors.text.primary,
    marginBottom: SPACING[2],
  },
  subtitle: {
    ...t.typography.body,
    color: t.colors.text.secondary,
  },
  form: {
    gap: SPACING[4],
  },
}));
