import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Card, Skeleton, ErrorState } from '@/shared/ui';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { useScreenView } from '@/features/analytics/tracker';
import { useVisitStats } from '@/features/health/hooks';
import { SPACING } from '@/shared/theme/types';

const MONTHS_SHORT = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

function formatMonth(ym: string): string {
  const [, m] = ym.split('-');
  return MONTHS_SHORT[parseInt(m, 10) - 1] ?? m;
}

export default function VisitStatsScreen() {
  useScreenView('client_visit_stats');
  const styles = useStyles();
  const { colors } = useTheme();
  const router = useRouter();

  const { data: stats, isLoading, isError, refetch } = useVisitStats();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>{'←'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Статистика</Text>
        </View>
        <View style={styles.skeletonList}><Skeleton variant="card" /><Skeleton variant="card" /></View>
      </SafeAreaView>
    );
  }

  if (isError || !stats) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>{'←'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Статистика</Text>
        </View>
        <ErrorState message="Не удалось загрузить статистику" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  const maxMonthly = Math.max(...stats.monthly.map((m) => m.count), 1);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>{'←'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Статистика</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary cards */}
        <View style={styles.summaryGrid}>
          <Card style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{stats.totalVisits}</Text>
            <Text style={styles.summaryLabel}>Всего</Text>
          </Card>
          <Card style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{stats.thisMonth}</Text>
            <Text style={styles.summaryLabel}>В этом месяце</Text>
          </Card>
          <Card style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{stats.avgPerWeek.toFixed(1)}</Text>
            <Text style={styles.summaryLabel}>Среднее/нед.</Text>
          </Card>
          <Card style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: colors.accent.primary }]}>{stats.streak}</Text>
            <Text style={styles.summaryLabel}>Серия недель</Text>
          </Card>
        </View>

        {/* Monthly chart (simple bar chart) */}
        <Text style={styles.sectionTitle}>По месяцам</Text>
        <Card style={styles.chartCard}>
          <View style={styles.chartContainer}>
            {stats.monthly.map((m) => (
              <View key={m.month} style={styles.barCol}>
                <Text style={styles.barValue}>{m.count}</Text>
                <View
                  style={[
                    styles.bar,
                    {
                      height: Math.max(4, (m.count / maxMonthly) * 120),
                      backgroundColor: colors.accent.primary,
                    },
                  ]}
                />
                <Text style={styles.barLabel}>{formatMonth(m.month)}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* By type */}
        <Text style={styles.sectionTitle}>По типу занятий</Text>
        {stats.byType.map((bt) => {
          const pct = Math.round((bt.count / stats.totalVisits) * 100);
          return (
            <Card key={bt.type} style={styles.typeCard}>
              <View style={styles.typeRow}>
                <Text style={styles.typeName}>{bt.type}</Text>
                <Text style={styles.typeCount}>{bt.count} ({pct}%)</Text>
              </View>
              <View style={styles.progressBg}>
                <View
                  style={[styles.progressFill, { width: `${pct}%`, backgroundColor: colors.accent.primary }]}
                />
              </View>
            </Card>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const useStyles = createStyles((t) => ({
  safe: { flex: 1, backgroundColor: t.colors.bg.primary },
  header: {
    flexDirection: 'row' as const, alignItems: 'center' as const,
    paddingHorizontal: SPACING[4], paddingTop: SPACING[2], paddingBottom: SPACING[3], gap: SPACING[3],
  },
  headerTitle: { ...t.typography.h3, color: t.colors.text.primary },
  backBtn: {
    width: 40, height: 40, borderRadius: t.radius.full,
    backgroundColor: t.colors.bg.elevated, alignItems: 'center' as const, justifyContent: 'center' as const,
  },
  backText: { fontSize: 20, color: t.colors.text.primary },
  skeletonList: { padding: SPACING[4], gap: SPACING[3] },
  content: { padding: SPACING[4], gap: SPACING[4], paddingBottom: SPACING[6] },
  summaryGrid: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: SPACING[3] },
  summaryItem: { width: '47%' as unknown as number, padding: SPACING[4], alignItems: 'center' as const, gap: SPACING[1] },
  summaryValue: { ...t.typography.h2, color: t.colors.text.primary },
  summaryLabel: { ...t.typography.caption, color: t.colors.text.tertiary, textAlign: 'center' as const },
  sectionTitle: { ...t.typography.h4, color: t.colors.text.primary },
  chartCard: { padding: SPACING[4] },
  chartContainer: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'flex-end' as const, height: 160 },
  barCol: { alignItems: 'center' as const, gap: SPACING[1], flex: 1 },
  bar: { width: 24, borderRadius: t.radius.sm },
  barValue: { ...t.typography.caption, color: t.colors.text.tertiary },
  barLabel: { ...t.typography.caption, color: t.colors.text.tertiary },
  typeCard: { padding: SPACING[4], gap: SPACING[2] },
  typeRow: { flexDirection: 'row' as const, justifyContent: 'space-between' as const },
  typeName: { ...t.typography.body, color: t.colors.text.primary },
  typeCount: { ...t.typography.bodySm, color: t.colors.text.secondary },
  progressBg: { height: 6, borderRadius: t.radius.full, backgroundColor: t.colors.bg.elevated },
  progressFill: { height: 6, borderRadius: t.radius.full },
}));
