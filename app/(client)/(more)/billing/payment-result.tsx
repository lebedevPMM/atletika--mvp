import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { Button, Card, Skeleton, ErrorState } from '@/shared/ui';
import { useHaptic } from '@/shared/hooks/useHaptic';
import { useScreenView } from '@/features/analytics/tracker';
import { usePaymentStatus } from '@/features/billing/hooks';
import { formatAmount } from '@/features/billing/utils';
import { SPACING } from '@/shared/theme/types';

export default function PaymentResultScreen() {
  useScreenView('client_payment_result');

  const { paymentId } = useLocalSearchParams<{ paymentId: string }>();

  const router = useRouter();
  const styles = useStyles();
  const { colors } = useTheme();
  const haptic = useHaptic();

  const { data: payment, isLoading, isError, refetch } = usePaymentStatus(paymentId || '');

  // Celebration haptic on mount
  useEffect(() => {
    haptic.success();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const methodLabel = payment?.method === 'sbp' ? 'СБП' : 'Банковская карта';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {isError ? (
        <ErrorState message="Не удалось загрузить данные" onRetry={refetch} />
      ) : isLoading || !payment ? (
        <View style={styles.loadingContainer}>
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </View>
      ) : (
        <View style={styles.container}>
          {/* Celebration section */}
          <View style={styles.celebrationSection}>
            <Text style={styles.celebrationEmoji}>{'\uD83C\uDF89'}</Text>
            <Text style={styles.celebrationTitle}>
              Оплата прошла успешно!
            </Text>
          </View>

          {/* Payment info card */}
          <Card style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Сумма</Text>
              <Text style={styles.infoValue}>
                {formatAmount(payment.amount, payment.currency)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Способ оплаты</Text>
              <Text style={styles.infoValue}>{methodLabel}</Text>
            </View>
          </Card>

          {/* Action buttons */}
          <View style={styles.actions}>
            <Button
              title="К счетам"
              onPress={() => router.replace('/(client)/(more)/billing' as never)}
              variant="primary"
              style={styles.actionButton}
            />
            <Button
              title="На главную"
              onPress={() => router.replace('/(client)/(home)' as never)}
              variant="ghost"
              style={styles.actionButton}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const useStyles = createStyles((t) => ({
  safe: {
    flex: 1,
    backgroundColor: t.colors.bg.primary,
  },
  loadingContainer: {
    flex: 1,
    padding: SPACING[4],
    gap: SPACING[3],
    justifyContent: 'center' as const,
  },
  container: {
    flex: 1,
    paddingHorizontal: SPACING[4],
    justifyContent: 'center' as const,
    gap: SPACING[6],
  },
  celebrationSection: {
    alignItems: 'center' as const,
    gap: SPACING[3],
  },
  celebrationEmoji: {
    fontSize: 72,
    textAlign: 'center' as const,
  },
  celebrationTitle: {
    ...t.typography.h1,
    color: t.colors.text.primary,
    textAlign: 'center' as const,
  },
  infoCard: {
    padding: SPACING[4],
    gap: SPACING[3],
  },
  infoRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  infoLabel: {
    ...t.typography.body,
    color: t.colors.text.secondary,
  },
  infoValue: {
    ...t.typography.body,
    color: t.colors.text.primary,
    fontWeight: '600' as const,
  },
  actions: {
    gap: SPACING[3],
  },
  actionButton: {
    width: '100%' as unknown as number,
  },
}));
