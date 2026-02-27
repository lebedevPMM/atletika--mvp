import { useCallback } from 'react';
import { View, Text, Pressable, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Skeleton, ErrorState, EmptyState, Card } from '@/shared/ui';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { useScreenView } from '@/features/analytics/tracker';
import { useBonusBalance, useBonusHistory } from '@/features/loyalty/hooks';
import { getTransactionTypeLabel, getTransactionIcon, formatBonusAmount, getTransactionColor } from '@/features/loyalty/utils';
import { formatNewsDate } from '@/features/club/utils';
import { SPACING } from '@/shared/theme/types';
import type { BonusTransaction } from '@/features/loyalty/types';

export default function LoyaltyScreen() {
  useScreenView('client_loyalty');
  const styles = useStyles();
  const { colors } = useTheme();
  const router = useRouter();

  const { data: balance, isLoading: balLoading, isError: balError, refetch: refetchBal } = useBonusBalance();
  const { data: history, isLoading: histLoading, isError: histError, refetch: refetchHist, isRefetching } = useBonusHistory();

  const isLoading = balLoading || histLoading;
  const isError = balError || histError;
  const refetch = useCallback(() => { refetchBal(); refetchHist(); }, [refetchBal, refetchHist]);

  const renderTransaction = useCallback(
    ({ item }: { item: BonusTransaction }) => {
      const colorKey = getTransactionColor(item.amount);
      const amountColor =
        colorKey === 'success' ? colors.semantic.success.main :
        colorKey === 'error' ? colors.semantic.error.main :
        colors.semantic.warning.main;

      return (
        <View style={styles.txRow}>
          <Text style={styles.txIcon}>{getTransactionIcon(item.type)}</Text>
          <View style={styles.txContent}>
            <Text style={styles.txDesc} numberOfLines={1}>{item.description}</Text>
            <View style={styles.txMeta}>
              <Text style={styles.txType}>{getTransactionTypeLabel(item.type)}</Text>
              <Text style={styles.txDate}>{formatNewsDate(item.createdAt)}</Text>
            </View>
          </View>
          <Text style={[styles.txAmount, { color: amountColor }]}>
            {formatBonusAmount(item.amount)}
          </Text>
        </View>
      );
    },
    [styles, colors],
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>{'←'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Бонусы</Text>
        </View>
        <View style={styles.skeletonList}><Skeleton variant="card" /><Skeleton variant="card" /></View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>{'←'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Бонусы</Text>
        </View>
        <ErrorState message="Не удалось загрузить бонусы" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>{'←'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Бонусы</Text>
      </View>

      {/* Balance card */}
      <Card style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Баланс</Text>
        <Text style={styles.balanceValue}>{balance?.total ?? 0}</Text>
        {(balance?.pending ?? 0) > 0 && (
          <Text style={styles.balancePending}>+{balance?.pending} в ожидании</Text>
        )}
      </Card>

      {/* Transaction history */}
      <Text style={styles.sectionTitle}>История</Text>
      <FlatList
        data={history ?? []}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        contentContainerStyle={[
          styles.listContent,
          (history ?? []).length === 0 && styles.emptyContainer,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.accent.primary} />
        }
        ListEmptyComponent={
          <EmptyState icon="💎" title="Нет операций" subtitle="История бонусных начислений и списаний появится здесь" />
        }
      />
    </SafeAreaView>
  );
}

const useStyles = createStyles((t) => ({
  safe: { flex: 1, backgroundColor: t.colors.bg.primary },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: SPACING[4],
    paddingTop: SPACING[2],
    paddingBottom: SPACING[3],
    gap: SPACING[3],
  },
  headerTitle: { ...t.typography.h3, color: t.colors.text.primary },
  backBtn: {
    width: 40, height: 40, borderRadius: t.radius.full,
    backgroundColor: t.colors.bg.elevated,
    alignItems: 'center' as const, justifyContent: 'center' as const,
  },
  backText: { fontSize: 20, color: t.colors.text.primary },
  balanceCard: {
    marginHorizontal: SPACING[4],
    marginBottom: SPACING[4],
    padding: SPACING[5],
    alignItems: 'center' as const,
    backgroundColor: t.colors.accent.primary,
    borderRadius: t.radius.xl,
  },
  balanceLabel: { ...t.typography.bodySm, color: t.colors.text.inverse, opacity: 0.8 },
  balanceValue: { fontSize: 48, fontWeight: '800' as const, color: t.colors.text.inverse, marginVertical: SPACING[1] },
  balancePending: { ...t.typography.caption, color: t.colors.text.inverse, opacity: 0.7 },
  sectionTitle: {
    ...t.typography.h4, color: t.colors.text.primary,
    paddingHorizontal: SPACING[4], marginBottom: SPACING[3],
  },
  skeletonList: { padding: SPACING[4], gap: SPACING[3] },
  listContent: { paddingHorizontal: SPACING[4], paddingBottom: SPACING[6], gap: SPACING[2] },
  emptyContainer: { flex: 1 },
  txRow: {
    flexDirection: 'row' as const,
    backgroundColor: t.colors.bg.elevated,
    borderRadius: t.radius.lg,
    padding: SPACING[4],
    gap: SPACING[3],
    alignItems: 'center' as const,
  },
  txIcon: { fontSize: 24 },
  txContent: { flex: 1, gap: SPACING[1] },
  txDesc: { ...t.typography.body, color: t.colors.text.primary },
  txMeta: { flexDirection: 'row' as const, gap: SPACING[2] },
  txType: { ...t.typography.caption, color: t.colors.text.tertiary },
  txDate: { ...t.typography.caption, color: t.colors.text.tertiary },
  txAmount: { ...t.typography.h4, fontWeight: '700' as const },
}));
