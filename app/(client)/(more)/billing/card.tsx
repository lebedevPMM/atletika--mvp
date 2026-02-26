import { useState, useEffect } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePaymentStatus } from '@/features/billing/hooks';
import { formatAmount } from '@/features/billing/utils';
import { Button } from '@/shared/ui';
import { createStyles } from '@/shared/theme/createStyles';
import { useScreenView } from '@/features/analytics/tracker';
import { SPACING } from '@/shared/theme/types';

export default function CardPayScreen() {
  const { paymentId } = useLocalSearchParams<{ paymentId: string }>();
  useScreenView('client_card_pay');
  const router = useRouter();
  const styles = useStyles();
  const [confirmed, setConfirmed] = useState(false);

  const { data: payment } = usePaymentStatus(paymentId || '', confirmed);

  const handleConfirm = () => {
    setConfirmed(true);
  };

  useEffect(() => {
    if (!payment) return;
    if (payment.status === 'success') {
      router.replace({
        pathname: '/(client)/(more)/billing/payment-result',
        params: { paymentId: payment.id },
      });
    } else if (payment.status === 'failed') {
      router.replace({
        pathname: '/(client)/(more)/billing/payment-failed',
        params: { paymentId: payment.id },
      });
    }
  }, [payment?.status, payment?.id, router]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.backButton}>{'<'} Назад</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.bankCard}>
          <View style={styles.bankHeader}>
            <Text style={styles.bankLogo}>{'\uD83C\uDFE6'}</Text>
            <Text style={styles.bankTitle}>Подтверждение оплаты</Text>
          </View>

          <View style={styles.bankBody}>
            <Text style={styles.bankLabel}>Сумма к оплате</Text>
            <Text style={styles.bankAmount}>
              {payment ? formatAmount(payment.amount, payment.currency) : '...'}
            </Text>

            <View style={styles.cardRow}>
              <Text style={styles.bankLabel}>Карта</Text>
              <Text style={styles.cardNumber}>{'\u2022\u2022\u2022\u2022'} 4242</Text>
            </View>

            <View style={styles.cardRow}>
              <Text style={styles.bankLabel}>Получатель</Text>
              <Text style={styles.cardNumber}>ООО «Атлетика»</Text>
            </View>
          </View>

          {confirmed ? (
            <View style={styles.loadingSection}>
              <ActivityIndicator size="large" color={styles.loadingText.color} />
              <Text style={styles.loadingText}>Обработка платежа...</Text>
            </View>
          ) : (
            <View style={styles.confirmSection}>
              <Text style={styles.secureText}>
                {'\uD83D\uDD12'} 3D Secure — подтвердите операцию
              </Text>
              <Button
                title="Подтвердить"
                onPress={handleConfirm}
                variant="primary"
              />
            </View>
          )}
        </View>

        <Text style={styles.disclaimer}>
          Это демонстрационный экран. Реальная оплата не производится.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const useStyles = createStyles((t) => ({
  container: {
    flex: 1,
    backgroundColor: t.colors.bg.primary,
  },
  header: {
    paddingHorizontal: SPACING[4],
    paddingTop: SPACING[2],
    paddingBottom: SPACING[2],
  },
  backButton: {
    ...t.typography.body,
    color: t.colors.text.accent,
  },
  content: {
    paddingHorizontal: SPACING[4],
    paddingBottom: SPACING[8],
    gap: SPACING[6],
    flex: 1,
  },
  bankCard: {
    backgroundColor: t.colors.bg.elevated,
    borderRadius: t.radius.xl,
    overflow: 'hidden' as const,
  },
  bankHeader: {
    backgroundColor: t.colors.accent.primary,
    paddingVertical: SPACING[4],
    paddingHorizontal: SPACING[4],
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: SPACING[2],
  },
  bankLogo: {
    fontSize: 24,
  },
  bankTitle: {
    ...t.typography.h3,
    color: t.colors.text.inverse,
  },
  bankBody: {
    padding: SPACING[4],
    gap: SPACING[4],
  },
  bankLabel: {
    ...t.typography.bodySm,
    color: t.colors.text.tertiary,
  },
  bankAmount: {
    ...t.typography.h2,
    color: t.colors.text.primary,
    marginTop: -SPACING[1],
  },
  cardRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  cardNumber: {
    ...t.typography.body,
    color: t.colors.text.primary,
    fontWeight: '600' as const,
  },
  confirmSection: {
    padding: SPACING[4],
    borderTopWidth: 1,
    borderTopColor: t.colors.border.default,
    gap: SPACING[3],
  },
  secureText: {
    ...t.typography.bodySm,
    color: t.colors.text.secondary,
    textAlign: 'center' as const,
  },
  loadingSection: {
    padding: SPACING[6],
    borderTopWidth: 1,
    borderTopColor: t.colors.border.default,
    alignItems: 'center' as const,
    gap: SPACING[3],
  },
  loadingText: {
    ...t.typography.body,
    color: t.colors.accent.primary,
  },
  disclaimer: {
    ...t.typography.caption,
    color: t.colors.text.tertiary,
    textAlign: 'center' as const,
  },
}));
