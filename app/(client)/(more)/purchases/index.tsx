import { useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { usePurchases } from '@/features/catalog/hooks';
import type { PurchasedService, PurchaseType } from '@/features/catalog/types';
import { formatDateShort } from '@/features/billing/utils';
import { Card, Badge, Button, SegmentedControl, EmptyState, ErrorState, Skeleton } from '@/shared/ui';
import { createStyles } from '@/shared/theme/createStyles';
import { useScreenView } from '@/features/analytics/tracker';
import { useTheme } from '@/shared/theme/useTheme';
import { SPACING } from '@/shared/theme/types';

const SEGMENTS = ['Активные', 'Истекшие'];
const STATUS_MAP = ['active', 'expired'] as const;

function typeLabel(type: PurchaseType): { text: string; variant: 'accent' | 'success' | 'info' | 'warning' } {
  switch (type) {
    case 'pt_pack':
      return { text: 'ПТ', variant: 'accent' };
    case 'spa_pack':
      return { text: 'СПА', variant: 'info' };
    case 'single':
      return { text: 'Разовая', variant: 'success' };
    case 'ticket':
      return { text: 'Билет', variant: 'warning' };
    case 'addon':
      return { text: 'Доп. услуга', variant: 'info' };
    default:
      return { text: type, variant: 'info' };
  }
}

function ProgressBar({ current, total, color }: { current: number; total: number; color: string }) {
  const styles = useStyles();
  const { colors } = useTheme();
  const progress = total > 0 ? Math.min(current / total, 1) : 0;

  return (
    <View style={[styles.progressTrack, { backgroundColor: colors.bg.surface }]}>
      <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: color }]} />
    </View>
  );
}

function PurchaseCard({ purchase }: { purchase: PurchasedService }) {
  const styles = useStyles();
  const { colors } = useTheme();
  const badge = typeLabel(purchase.type);

  return (
    <Card style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {purchase.title}
        </Text>
        <View style={styles.badgesRow}>
          <Badge text={badge.text} variant={badge.variant} />
          {purchase.expiringSoon && <Badge text="Скоро истекает" variant="warning" />}
        </View>
      </View>

      {purchase.qtyTotal > 1 && (
        <View style={styles.progressSection}>
          <Text style={styles.progressLabel}>
            {purchase.qtyLeft} из {purchase.qtyTotal} осталось
          </Text>
          <ProgressBar
            current={purchase.qtyLeft}
            total={purchase.qtyTotal}
            color={
              purchase.qtyLeft <= 1
                ? colors.semantic.warning.main
                : colors.accent.primary
            }
          />
        </View>
      )}

      <View style={styles.cardFooter}>
        <Text style={styles.dateText}>
          до {formatDateShort(purchase.validTo)}
        </Text>
        {purchase.status === 'active' && purchase.qtyLeft > 0 && (
          <Button title="Записаться" size="small" variant="secondary" onPress={() => {}} />
        )}
      </View>
    </Card>
  );
}

function LoadingSkeleton() {
  const styles = useStyles();
  return (
    <View style={styles.list}>
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} variant="list" style={{ height: 110 }} />
      ))}
    </View>
  );
}

export default function PurchasesScreen() {
  useScreenView('client_purchases');
  const styles = useStyles();
  const router = useRouter();
  const [segmentIndex, setSegmentIndex] = useState(0);

  const status = STATUS_MAP[segmentIndex];
  const { data: purchases, isLoading, isError, refetch, isRefetching } = usePurchases(status);

  const renderItem = useCallback(
    ({ item }: { item: PurchasedService }) => <PurchaseCard purchase={item} />,
    [],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.backButton}>{'<'} Назад</Text>
        </Pressable>
        <Text style={styles.title}>Купленные услуги</Text>
      </View>

      <View style={styles.segmentWrapper}>
        <SegmentedControl
          segments={SEGMENTS}
          selectedIndex={segmentIndex}
          onSelect={setSegmentIndex}
        />
      </View>

      {isError ? (
        <ErrorState message="Не удалось загрузить купленные услуги" onRetry={refetch} />
      ) : isLoading ? (
        <LoadingSkeleton />
      ) : (
        <FlatList
          data={purchases || []}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
          ListEmptyComponent={
            <EmptyState
              icon="🛍️"
              title="Пока нет купленных услуг"
              subtitle={
                segmentIndex === 0
                  ? 'Активных покупок нет'
                  : 'Истекших покупок нет'
              }
              actionTitle="Открыть каталог"
              onAction={() => router.push('/(client)/(more)/catalog')}
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
  badgesRow: {
    flexDirection: 'row' as const,
    gap: SPACING[1],
  },
  progressSection: {
    marginBottom: SPACING[2],
  },
  progressLabel: {
    ...t.typography.bodySm,
    color: t.colors.text.secondary,
    marginBottom: SPACING[1],
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden' as const,
  },
  progressFill: {
    height: '100%' as const,
    borderRadius: 3,
  },
  cardFooter: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  dateText: {
    ...t.typography.bodySm,
    color: t.colors.text.secondary,
  },
}));
