import { useState, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { SPACING } from '@/shared/theme/types';
import { useScreenView } from '@/features/analytics/tracker';
import { useHaptic } from '@/shared/hooks/useHaptic';
import { useTrainerDaySummary, useEndShift } from '@/features/trainer/hooks';
import { Button, Card, Skeleton, ErrorState } from '@/shared/ui';
import type { TrainerSummarySession } from '@/features/trainer/types';

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h} ч ${m} мин`;
}

export default function ShiftEndScreen() {
  useScreenView('trainer_shift_end');
  const styles = useStyles();
  const { colors } = useTheme();
  const router = useRouter();
  const haptic = useHaptic();

  const { data: summary, isLoading, isError, refetch } = useTrainerDaySummary();
  const endShift = useEndShift();
  const [notes, setNotes] = useState('');

  const handleEndShift = useCallback(() => {
    haptic.medium();
    Alert.alert(
      'Завершить смену?',
      'Вы уверены, что хотите завершить рабочий день?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Завершить',
          style: 'destructive',
          onPress: () => {
            endShift.mutate(
              { date: summary?.date ?? new Date().toISOString().split('T')[0], notes: notes || undefined },
              {
                onSuccess: () => {
                  Alert.alert('Готово', 'Смена завершена. Хорошего отдыха!');
                  router.back();
                },
                onError: () => {
                  Alert.alert('Ошибка', 'Не удалось завершить смену');
                },
              },
            );
          },
        },
      ],
    );
  }, [haptic, endShift, summary, notes, router]);

  const getSessionIcon = (session: TrainerSummarySession): string => {
    if (session.cancelled) return '\u274C';
    if (session.completed) return '\u2705';
    return '\u23F3';
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>{'←'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Завершение смены</Text>
        </View>
        <View style={styles.skeletonList}>
          <Skeleton variant="card" />
          <Skeleton variant="card" />
          <Skeleton variant="list" />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !summary) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>{'←'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Завершение смены</Text>
        </View>
        <ErrorState message="Не удалось загрузить данные дня" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>{'←'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Завершение смены</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Stats summary */}
        <Card style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Итоги дня</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{summary.sessionsCount}</Text>
              <Text style={styles.statLabel}>Занятий</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{summary.clientsCount}</Text>
              <Text style={styles.statLabel}>Клиентов</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, summary.cancellations > 0 && { color: colors.semantic.error.main }]}>
                {summary.cancellations}
              </Text>
              <Text style={styles.statLabel}>Отмен</Text>
            </View>
          </View>
        </Card>

        {/* Time range */}
        <Card style={styles.timeCard}>
          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>Начало</Text>
            <Text style={styles.timeValue}>{summary.startTime}</Text>
          </View>
          <View style={styles.timeDivider} />
          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>Конец</Text>
            <Text style={styles.timeValue}>{summary.endTime}</Text>
          </View>
          <View style={styles.timeDivider} />
          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>Длительность</Text>
            <Text style={styles.timeValue}>{formatDuration(summary.durationMinutes)}</Text>
          </View>
        </Card>

        {/* Sessions list */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Занятия</Text>
          {summary.sessions.map((session: TrainerSummarySession) => (
            <View key={session.id} style={styles.sessionRow}>
              <Text style={styles.sessionIcon}>{getSessionIcon(session)}</Text>
              <View style={styles.sessionInfo}>
                <Text style={[styles.sessionTitle, session.cancelled && styles.sessionCancelled]}>
                  {session.title}
                </Text>
                <Text style={styles.sessionTime}>
                  {session.time}
                  {session.type === 'group' && session.attendeeCount != null && ` \u2022 ${session.attendeeCount} чел.`}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Заметки</Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="Добавьте заметки о дне (необязательно)"
            placeholderTextColor={colors.text.tertiary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <Button
          title="Завершить смену"
          variant="danger"
          onPress={handleEndShift}
          loading={endShift.isPending}
        />
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
  statsCard: { gap: SPACING[3] },
  sectionTitle: { ...t.typography.h4, color: t.colors.text.primary },
  statsGrid: { flexDirection: 'row' as const, justifyContent: 'space-around' as const },
  statItem: { alignItems: 'center' as const, gap: SPACING[1] },
  statValue: { ...t.typography.h2, color: t.colors.text.primary },
  statLabel: { ...t.typography.caption, color: t.colors.text.secondary },
  timeCard: { gap: SPACING[3] },
  timeRow: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const },
  timeLabel: { ...t.typography.bodySm, color: t.colors.text.secondary },
  timeValue: { ...t.typography.bodySm, color: t.colors.text.primary, fontWeight: '600' as const },
  timeDivider: { height: 1, backgroundColor: t.colors.border.default },
  section: { gap: SPACING[3] },
  sessionRow: {
    flexDirection: 'row' as const, alignItems: 'center' as const, gap: SPACING[3],
    backgroundColor: t.colors.bg.elevated, borderRadius: t.radius.md, padding: SPACING[3],
  },
  sessionIcon: { fontSize: 18 },
  sessionInfo: { flex: 1, gap: SPACING[1] },
  sessionTitle: { ...t.typography.body, color: t.colors.text.primary },
  sessionCancelled: { textDecorationLine: 'line-through' as const, color: t.colors.text.tertiary },
  sessionTime: { ...t.typography.caption, color: t.colors.text.secondary },
  notesInput: {
    borderWidth: 1, borderColor: t.colors.border.default, borderRadius: t.radius.md,
    padding: SPACING[3], minHeight: 100, color: t.colors.text.primary,
    backgroundColor: t.colors.bg.elevated, ...t.typography.body,
  },
}));
