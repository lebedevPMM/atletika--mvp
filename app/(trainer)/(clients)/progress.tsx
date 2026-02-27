import { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { SPACING } from '@/shared/theme/types';
import { useScreenView } from '@/features/analytics/tracker';
import { useTrainerClientProgress } from '@/features/trainer/hooks';
import { Card, Skeleton, ErrorState, SegmentedControl, Badge } from '@/shared/ui';
import type { TrainerProgressMetric, TrainerProgressNote } from '@/features/trainer/types';

const PERIODS = ['Неделя', 'Месяц', '3 месяца'];

export default function TrainerClientProgressScreen() {
  useScreenView('trainer_client_progress');
  const styles = useStyles();
  const { colors } = useTheme();
  const router = useRouter();

  const { clientId } = useLocalSearchParams<{ clientId: string }>();
  const resolvedClientId = clientId ?? 'client-1';
  const { data: progress, isLoading, isError, refetch } = useTrainerClientProgress(resolvedClientId);
  const [periodIndex, setPeriodIndex] = useState(1);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>{'←'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Прогресс клиента</Text>
        </View>
        <View style={styles.skeletonList}>
          <Skeleton variant="card" />
          <Skeleton variant="card" />
          <Skeleton variant="list" />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !progress) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>{'←'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Прогресс клиента</Text>
        </View>
        <ErrorState message="Не удалось загрузить прогресс" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  const trendColor = progress.visitsTrend >= 0 ? colors.semantic.success.main : colors.semantic.error.main;
  const trendSign = progress.visitsTrend >= 0 ? '+' : '';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>{'←'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Прогресс клиента</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Client Name */}
        <Text style={styles.clientName}>{progress.clientName}</Text>

        {/* Period selector */}
        <SegmentedControl
          segments={PERIODS}
          selectedIndex={periodIndex}
          onSelect={setPeriodIndex}
        />

        {/* Visits per week */}
        <Card style={styles.visitsCard}>
          <Text style={styles.sectionTitle}>Посещения</Text>
          <View style={styles.visitsRow}>
            <View style={styles.visitsMain}>
              <Text style={styles.visitsValue}>{progress.visitsPerWeek.toFixed(1)}</Text>
              <Text style={styles.visitsLabel}>раз/неделю</Text>
            </View>
            <View style={[styles.trendBadge, { backgroundColor: trendColor + '20' }]}>
              <Text style={[styles.trendText, { color: trendColor }]}>
                {trendSign}{progress.visitsTrend}%
              </Text>
            </View>
          </View>
        </Card>

        {/* Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Показатели</Text>
          <View style={styles.metricsGrid}>
            {progress.metrics.map((metric: TrainerProgressMetric) => (
              <Card key={metric.label} style={styles.metricCard}>
                <Text style={styles.metricLabel}>{metric.label}</Text>
                <View style={styles.metricValues}>
                  <Text style={styles.metricStart}>{metric.startValue}</Text>
                  <Text style={styles.metricArrow}>{'\u2192'}</Text>
                  <Text style={styles.metricCurrent}>{metric.currentValue}</Text>
                </View>
                <Badge
                  text={metric.change}
                  variant={metric.improved ? 'success' : 'error'}
                />
              </Card>
            ))}
          </View>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Заметки тренера</Text>
          {progress.notes.map((note: TrainerProgressNote) => (
            <Card key={note.id} style={styles.noteCard}>
              <Text style={styles.noteDate}>{note.date}</Text>
              <Text style={styles.noteText}>{note.text}</Text>
            </Card>
          ))}
        </View>
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
  scroll: { flex: 1 },
  content: { padding: SPACING[4], gap: SPACING[4], paddingBottom: SPACING[10] },
  clientName: { ...t.typography.h2, color: t.colors.text.primary },
  visitsCard: { gap: SPACING[3] },
  sectionTitle: { ...t.typography.h4, color: t.colors.text.primary },
  visitsRow: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const },
  visitsMain: { flexDirection: 'row' as const, alignItems: 'baseline' as const, gap: SPACING[2] },
  visitsValue: { ...t.typography.h1, color: t.colors.text.primary },
  visitsLabel: { ...t.typography.bodySm, color: t.colors.text.secondary },
  trendBadge: {
    paddingHorizontal: SPACING[3], paddingVertical: SPACING[1], borderRadius: t.radius.full,
  },
  trendText: { ...t.typography.bodySm, fontWeight: '600' as const },
  section: { gap: SPACING[3] },
  metricsGrid: { gap: SPACING[2] },
  metricCard: { gap: SPACING[2] },
  metricLabel: { ...t.typography.bodySm, color: t.colors.text.secondary },
  metricValues: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: SPACING[2] },
  metricStart: { ...t.typography.body, color: t.colors.text.tertiary },
  metricArrow: { ...t.typography.body, color: t.colors.text.tertiary },
  metricCurrent: { ...t.typography.bodyLg, color: t.colors.text.primary, fontWeight: '600' as const },
  noteCard: { gap: SPACING[1] },
  noteDate: { ...t.typography.caption, color: t.colors.text.tertiary },
  noteText: { ...t.typography.body, color: t.colors.text.primary },
}));
