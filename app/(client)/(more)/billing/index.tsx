import { useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useInvoices } from '@/features/billing/hooks';
import type { Invoice, InvoiceStatus } from '@/features/billing/types';
import { Card, Badge, SegmentedControl, EmptyState, Skeleton } from '@/shared/ui';
import { createStyles } from '@/shared/theme/createStyles';
import { useScreenView } from '@/features/analytics/tracker';
import { SPACING } from '@/shared/theme/types';

const SEGMENTS = ['Открытые', 'Оплаченные'];
const STATUS_MAP: InvoiceStatus[] = ['open', 'paid'];

function formatAmount(amount: number, currency: string) {
  if (currency === 'RUB') return `${amount.toLocaleString('ru-RU')} \u20BD`;
  return `${amount} ${currency}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
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

function InvoiceCard({ invoice, onPress }: { invoice: Invoice; onPress: () => void }) {
  const styles = useStyles();
  const badge = statusBadge(invoice.status);

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {invoice.title}
        </Text>
        <Badge text={badge.text} variant={badge.variant} />
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.amount}>{formatAmount(invoice.amount, invoice.currency)}</Text>
        <Text style={styles.date}>
          {invoice.status === 'paid' && invoice.paidAt
            ? `Оплачен ${formatDate(invoice.paidAt)}`
            : `До ${formatDate(invoice.dueDate)}`}
        </Text>
      </View>
    </Card>
  );
}

function LoadingSkeleton() {
  const styles = useStyles();
  return (
    <View style={styles.list}>
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} variant="list" style={{ height: 88 }} />
      ))}
    </View>
  );
}

export default function BillingListScreen() {
  useScreenView('client_billing_list');
  const router = useRouter();
  const styles = useStyles();
  const [segmentIndex, setSegmentIndex] = useState(0);

  const status = STATUS_MAP[segmentIndex];
  const { data: invoices, isLoading, refetch, isRefetching } = useInvoices(status);

  const handlePress = useCallback(
    (invoiceId: string) => {
      router.push(`/(client)/(more)/billing/${invoiceId}`);
    },
    [router],
  );

  const renderItem = useCallback(
    ({ item }: { item: Invoice }) => (
      <InvoiceCard invoice={item} onPress={() => handlePress(item.id)} />
    ),
    [handlePress],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.backButton}>{'<'} Назад</Text>
        </Pressable>
        <Text style={styles.title}>Счета</Text>
      </View>

      <View style={styles.segmentWrapper}>
        <SegmentedControl
          segments={SEGMENTS}
          selectedIndex={segmentIndex}
          onSelect={setSegmentIndex}
        />
      </View>

      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <FlatList
          data={invoices || []}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
          ListEmptyComponent={
            <EmptyState
              icon="\uD83D\uDCCB"
              title="Нет счетов"
              subtitle={
                segmentIndex === 0
                  ? 'Открытых счетов нет'
                  : 'Оплаченных счетов пока нет'
              }
            />
          }
        />
      )}
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
    paddingBottom: SPACING[4],
  },
  backButton: {
    ...t.typography.body,
    color: t.colors.text.accent,
    marginBottom: SPACING[2],
  },
  title: {
    ...t.typography.h2,
    color: t.colors.text.primary,
  },
  segmentWrapper: {
    paddingHorizontal: SPACING[4],
    marginBottom: SPACING[4],
  },
  list: {
    paddingHorizontal: SPACING[4],
    gap: SPACING[3],
    paddingBottom: SPACING[8],
  },
  card: {
    paddingVertical: SPACING[3],
    paddingHorizontal: SPACING[4],
  },
  cardHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: SPACING[2],
  },
  cardTitle: {
    ...t.typography.bodyLg,
    color: t.colors.text.primary,
    fontWeight: '600' as const,
    flex: 1,
    marginRight: SPACING[2],
  },
  cardFooter: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  amount: {
    ...t.typography.h4,
    color: t.colors.text.primary,
  },
  date: {
    ...t.typography.bodySm,
    color: t.colors.text.secondary,
  },
}));
