import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { Button, Card, Skeleton, ErrorState } from '@/shared/ui';
import { useScreenView } from '@/features/analytics/tracker';
import { usePaymentStatus } from '@/features/billing/hooks';
import { formatAmount } from '@/features/billing/utils';
import { SPACING } from '@/shared/theme/types';

export default function PaymentFailedScreen() {
  useScreenView('client_payment_failed');

  const { paymentId } = useLocalSearchParams<{ paymentId: string }>();

  const router = useRouter();
  const styles = useStyles();
  const { colors } = useTheme();

  const { data: payment, isLoading, isError, refetch } = usePaymentStatus(paymentId || '');

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
          {/* Error section */}
          <View style={styles.errorSection}>
            <Text style={styles.errorEmoji}>{'\u274C'}</Text>
            <Text style={styles.errorTitle}>Оплата не прошла</Text>
            <Text style={styles.errorMessage}>
              Попробуйте другой способ оплаты или повторите позже
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
          </Card>

          {/* Action buttons */}
          <View style={styles.actions}>
            <Button
              title="Попробовать снова"
              onPress={() =>
                router.replace({
                  pathname: '/(client)/(more)/billing/pay',
                  params: { invoiceId: payment.invoiceId },
                } as never)
              }
              variant="primary"
              style={styles.actionButton}
            />
            <Button
              title="К счетам"
              onPress={() => router.replace('/(client)/(more)/billing' as never)}
              variant="secondary"
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
  errorSection: {
    alignItems: 'center' as const,
    gap: SPACING[3],
  },
  errorEmoji: {
    fontSize: 72,
    textAlign: 'center' as const,
  },
  errorTitle: {
    ...t.typography.h1,
    color: t.colors.semantic.error.main,
    textAlign: 'center' as const,
  },
  errorMessage: {
    ...t.typography.body,
    color: t.colors.text.secondary,
    textAlign: 'center' as const,
    paddingHorizontal: SPACING[4],
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
