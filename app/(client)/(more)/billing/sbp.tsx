import { useEffect } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePaymentStatus } from '@/features/billing/hooks';
import { Button } from '@/shared/ui';
import { createStyles } from '@/shared/theme/createStyles';
import { useScreenView } from '@/features/analytics/tracker';
import { SPACING, LAYOUT } from '@/shared/theme/types';

function formatAmount(amount: number, currency: string) {
  if (currency === 'RUB') return `${amount.toLocaleString('ru-RU')} \u20BD`;
  return `${amount} ${currency}`;
}

export default function SbpPayScreen() {
  const { paymentId } = useLocalSearchParams<{ paymentId: string }>();
  useScreenView('client_sbp_pay');
  const router = useRouter();
  const styles = useStyles();

  const { data: payment } = usePaymentStatus(paymentId || '');

  useEffect(() => {
    if (!payment) return;
    if (payment.status === 'success') {
      router.replace({
        pathname: '/(client)/(more)/billing/payment-result',
        params: { paymentId: payment.id },
      });
    } else if (payment.status === 'failed') {
      router.replace({
        pathname: '/(client)/(more)/billing/payment-result',
        params: { paymentId: payment.id },
      });
    }
  }, [payment?.status]);

  const isPolling = payment?.status === 'pending' || payment?.status === 'processing';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.backButton}>{'<'} Назад</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Оплата через СБП</Text>
        <Text style={styles.subtitle}>
          Отсканируйте QR-код в приложении вашего банка
        </Text>

        <View style={styles.qrContainer}>
          <View style={styles.qrCode}>
            {/* Mock QR code: bordered square with pattern */}
            <View style={styles.qrInner}>
              <View style={styles.qrCornerTL} />
              <View style={styles.qrCornerTR} />
              <View style={styles.qrCornerBL} />
              <Text style={styles.qrText}>QR</Text>
              {/* Checkerboard pattern rows */}
              <View style={styles.qrPatternRow}>
                <View style={styles.qrBlock} />
                <View style={styles.qrBlockEmpty} />
                <View style={styles.qrBlock} />
                <View style={styles.qrBlockEmpty} />
                <View style={styles.qrBlock} />
              </View>
              <View style={styles.qrPatternRow}>
                <View style={styles.qrBlockEmpty} />
                <View style={styles.qrBlock} />
                <View style={styles.qrBlockEmpty} />
                <View style={styles.qrBlock} />
                <View style={styles.qrBlockEmpty} />
              </View>
              <View style={styles.qrPatternRow}>
                <View style={styles.qrBlock} />
                <View style={styles.qrBlockEmpty} />
                <View style={styles.qrBlock} />
                <View style={styles.qrBlockEmpty} />
                <View style={styles.qrBlock} />
              </View>
            </View>
          </View>
        </View>

        {payment && (
          <Text style={styles.amount}>
            {formatAmount(payment.amount, payment.currency)}
          </Text>
        )}

        {isPolling && (
          <View style={styles.statusRow}>
            <ActivityIndicator size="small" color={styles.statusText.color} />
            <Text style={styles.statusText}>Ожидание оплаты...</Text>
          </View>
        )}

        <View style={styles.cancelSection}>
          <Button
            title="Отменить"
            onPress={() => router.back()}
            variant="ghost"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const QR_SIZE = LAYOUT.qr.size;
const QR_CORNER = 40;
const QR_BLOCK = 16;

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
    gap: SPACING[4],
    alignItems: 'center' as const,
    flex: 1,
  },
  title: {
    ...t.typography.h2,
    color: t.colors.text.primary,
    textAlign: 'center' as const,
  },
  subtitle: {
    ...t.typography.body,
    color: t.colors.text.secondary,
    textAlign: 'center' as const,
    marginBottom: SPACING[2],
  },
  qrContainer: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  qrCode: {
    width: QR_SIZE,
    height: QR_SIZE,
    backgroundColor: '#FFFFFF',
    borderRadius: t.radius.lg,
    padding: SPACING[4],
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  qrInner: {
    width: QR_SIZE - SPACING[8],
    height: QR_SIZE - SPACING[8],
    borderWidth: 3,
    borderColor: '#000000',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    position: 'relative' as const,
  },
  qrCornerTL: {
    position: 'absolute' as const,
    top: 8,
    left: 8,
    width: QR_CORNER,
    height: QR_CORNER,
    borderWidth: 4,
    borderColor: '#000000',
    backgroundColor: '#000000',
  },
  qrCornerTR: {
    position: 'absolute' as const,
    top: 8,
    right: 8,
    width: QR_CORNER,
    height: QR_CORNER,
    borderWidth: 4,
    borderColor: '#000000',
    backgroundColor: '#000000',
  },
  qrCornerBL: {
    position: 'absolute' as const,
    bottom: 8,
    left: 8,
    width: QR_CORNER,
    height: QR_CORNER,
    borderWidth: 4,
    borderColor: '#000000',
    backgroundColor: '#000000',
  },
  qrText: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#000000',
    letterSpacing: 4,
  },
  qrPatternRow: {
    flexDirection: 'row' as const,
    gap: 4,
    marginTop: 4,
  },
  qrBlock: {
    width: QR_BLOCK,
    height: QR_BLOCK,
    backgroundColor: '#000000',
  },
  qrBlockEmpty: {
    width: QR_BLOCK,
    height: QR_BLOCK,
    backgroundColor: 'transparent',
  },
  amount: {
    ...t.typography.h1,
    color: t.colors.text.primary,
    textAlign: 'center' as const,
  },
  statusRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: SPACING[2],
  },
  statusText: {
    ...t.typography.body,
    color: t.colors.accent.primary,
  },
  cancelSection: {
    marginTop: 'auto' as const,
    alignSelf: 'stretch' as const,
    paddingBottom: SPACING[4],
  },
}));
