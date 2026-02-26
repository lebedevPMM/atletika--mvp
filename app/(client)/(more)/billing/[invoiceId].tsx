import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useInvoice } from '@/features/billing/hooks';
import type { InvoiceStatus } from '@/features/billing/types';
import { Badge, Button, Skeleton } from '@/shared/ui';
import { createStyles } from '@/shared/theme/createStyles';
import { useScreenView } from '@/features/analytics/tracker';
import { SPACING } from '@/shared/theme/types';

function formatAmount(amount: number, currency: string) {
  if (currency === 'RUB') return `${amount.toLocaleString('ru-RU')} \u20BD`;
  return `${amount} ${currency}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function statusBadge(status: InvoiceStatus): { text: string; variant: 'warning' | 'success' | 'error' | 'info' } {
  switch (status) {
    case 'open':
      return { text: 'Открыт', variant: 'warning' };
    case 'paid':
      return { text: 'Оплачен', variant: 'success' };
    case 'overdue':
      return { text: 'Просрочен', variant: 'error' };
    case 'cancelled':
      return { text: 'Отменен', variant: 'info' };
    default:
      return { text: status, variant: 'info' };
  }
}

export default function InvoiceDetailScreen() {
  const { invoiceId } = useLocalSearchParams<{ invoiceId: string }>();
  useScreenView('client_invoice_detail');
  const router = useRouter();
  const styles = useStyles();

  const { data: invoice, isLoading } = useInvoice(invoiceId || '');

  if (isLoading || !invoice) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={styles.backButton}>{'<'} Назад</Text>
          </Pressable>
        </View>
        <View style={styles.content}>
          <Skeleton variant="list" style={{ height: 28 }} />
          <Skeleton variant="card" />
          <Skeleton variant="list" style={{ height: 24 }} />
        </View>
      </SafeAreaView>
    );
  }

  const badge = statusBadge(invoice.status);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.backButton}>{'<'} Назад</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{invoice.title}</Text>
          <Badge text={badge.text} variant={badge.variant} />
        </View>

        {invoice.description && (
          <Text style={styles.description}>{invoice.description}</Text>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Позиции</Text>
          {invoice.items.map((item, idx) => (
            <View key={idx} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQty}>{item.quantity} шт.</Text>
              </View>
              <Text style={styles.itemPrice}>
                {formatAmount(item.price * item.quantity, invoice.currency)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Итого</Text>
          <Text style={styles.totalAmount}>
            {formatAmount(invoice.amount, invoice.currency)}
          </Text>
        </View>

        <View style={styles.metaSection}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Дата выставления</Text>
            <Text style={styles.metaValue}>{formatDate(invoice.createdAt)}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Срок оплаты</Text>
            <Text style={styles.metaValue}>{formatDate(invoice.dueDate)}</Text>
          </View>
          {invoice.status === 'paid' && invoice.paidAt && (
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Оплачен</Text>
              <View style={styles.paidRow}>
                <Text style={styles.paidCheck}>{'\u2705'}</Text>
                <Text style={styles.metaValue}>{formatDate(invoice.paidAt)}</Text>
              </View>
            </View>
          )}
        </View>

        {invoice.status === 'open' && (
          <View style={styles.paySection}>
            <Button
              title="Оплатить"
              onPress={() =>
                router.push({
                  pathname: '/(client)/(more)/billing/pay',
                  params: { invoiceId: invoice.id },
                })
              }
            />
          </View>
        )}
      </ScrollView>
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
  titleRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    gap: SPACING[3],
  },
  title: {
    ...t.typography.h2,
    color: t.colors.text.primary,
    flex: 1,
  },
  description: {
    ...t.typography.body,
    color: t.colors.text.secondary,
  },
  section: {
    gap: SPACING[2],
  },
  sectionTitle: {
    ...t.typography.overline,
    color: t.colors.text.tertiary,
    marginBottom: SPACING[1],
  },
  itemRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    backgroundColor: t.colors.bg.elevated,
    borderRadius: t.radius.md,
    paddingVertical: SPACING[3],
    paddingHorizontal: SPACING[4],
  },
  itemInfo: {
    flex: 1,
    gap: 2,
  },
  itemName: {
    ...t.typography.body,
    color: t.colors.text.primary,
  },
  itemQty: {
    ...t.typography.bodySm,
    color: t.colors.text.secondary,
  },
  itemPrice: {
    ...t.typography.bodyLg,
    color: t.colors.text.primary,
    fontWeight: '600' as const,
  },
  totalRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    borderTopWidth: 1,
    borderTopColor: t.colors.border.default,
    paddingTop: SPACING[4],
  },
  totalLabel: {
    ...t.typography.bodyLg,
    color: t.colors.text.secondary,
  },
  totalAmount: {
    ...t.typography.h3,
    color: t.colors.text.primary,
  },
  metaSection: {
    gap: SPACING[2],
  },
  metaRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  metaLabel: {
    ...t.typography.bodySm,
    color: t.colors.text.tertiary,
  },
  metaValue: {
    ...t.typography.bodySm,
    color: t.colors.text.primary,
  },
  paidRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: SPACING[1],
  },
  paidCheck: {
    fontSize: 16,
  },
  paySection: {
    marginTop: SPACING[4],
  },
}));
