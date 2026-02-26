import { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useInvoice, useCreatePayment } from '@/features/billing/hooks';
import type { PaymentMethod } from '@/features/billing/types';
import { formatAmount } from '@/features/billing/utils';
import { Skeleton } from '@/shared/ui';
import { createStyles } from '@/shared/theme/createStyles';
import { useScreenView } from '@/features/analytics/tracker';
import { SPACING } from '@/shared/theme/types';

export default function PaymentMethodScreen() {
  const { invoiceId } = useLocalSearchParams<{ invoiceId: string }>();
  useScreenView('client_payment_method');
  const router = useRouter();
  const styles = useStyles();
  const { data: invoice, isLoading: invoiceLoading } = useInvoice(invoiceId || '');
  const createPayment = useCreatePayment();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  const handleSelect = async (method: PaymentMethod) => {
    if (createPayment.isPending || !invoiceId) return;
    setSelectedMethod(method);
    try {
      const payment = await createPayment.mutateAsync({ invoiceId, method });
      if (method === 'card') {
        router.push({
          pathname: '/(client)/(more)/billing/card',
          params: { paymentId: payment.id },
        });
      } else {
        router.push({
          pathname: '/(client)/(more)/billing/sbp',
          params: { paymentId: payment.id },
        });
      }
    } catch {
      setSelectedMethod(null);
    }
  };

  if (invoiceLoading || !invoice) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={styles.backButton}>{'<'} Назад</Text>
          </Pressable>
        </View>
        <View style={styles.content}>
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.backButton}>{'<'} Назад</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Способ оплаты</Text>
        <Text style={styles.amount}>
          {formatAmount(invoice.amount, invoice.currency)}
        </Text>

        <View style={styles.methods}>
          <Pressable
            style={[
              styles.methodCard,
              selectedMethod === 'card' && createPayment.isPending && styles.methodCardSelected,
            ]}
            onPress={() => handleSelect('card')}
            disabled={createPayment.isPending}
          >
            {selectedMethod === 'card' && createPayment.isPending ? (
              <ActivityIndicator color={styles.methodIcon.color} size="large" />
            ) : (
              <Text style={styles.methodIcon}>{'\uD83D\uDCB3'}</Text>
            )}
            <Text style={styles.methodTitle}>Банковская карта</Text>
            <Text style={styles.methodSubtitle}>Visa, Mastercard, МИР</Text>
          </Pressable>

          <Pressable
            style={[
              styles.methodCard,
              selectedMethod === 'sbp' && createPayment.isPending && styles.methodCardSelected,
            ]}
            onPress={() => handleSelect('sbp')}
            disabled={createPayment.isPending}
          >
            {selectedMethod === 'sbp' && createPayment.isPending ? (
              <ActivityIndicator color={styles.methodIcon.color} size="large" />
            ) : (
              <Text style={styles.methodIcon}>{'\uD83D\uDCF1'}</Text>
            )}
            <Text style={styles.methodTitle}>СБП</Text>
            <Text style={styles.methodSubtitle}>Моментальный перевод</Text>
          </Pressable>
        </View>
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
    gap: SPACING[4],
  },
  title: {
    ...t.typography.h2,
    color: t.colors.text.primary,
    textAlign: 'center' as const,
  },
  amount: {
    ...t.typography.h1,
    color: t.colors.text.primary,
    textAlign: 'center' as const,
    marginBottom: SPACING[4],
  },
  methods: {
    gap: SPACING[4],
  },
  methodCard: {
    backgroundColor: t.colors.bg.elevated,
    borderRadius: t.radius.lg,
    paddingVertical: SPACING[6],
    paddingHorizontal: SPACING[4],
    alignItems: 'center' as const,
    gap: SPACING[2],
    borderWidth: 2,
    borderColor: 'transparent',
  },
  methodCardSelected: {
    borderColor: t.colors.accent.primary,
  },
  methodIcon: {
    fontSize: 48,
    color: t.colors.text.primary,
  },
  methodTitle: {
    ...t.typography.h3,
    color: t.colors.text.primary,
  },
  methodSubtitle: {
    ...t.typography.bodySm,
    color: t.colors.text.secondary,
  },
}));
