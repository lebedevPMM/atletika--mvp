import { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Skeleton, ErrorState, Button } from '@/shared/ui';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { useHaptic } from '@/shared/hooks/useHaptic';
import { useScreenView } from '@/features/analytics/tracker';
import { useWorkoutPlan } from '@/features/workout/hooks';
import type { WorkoutExercise } from '@/features/workout/types';
import { SPACING } from '@/shared/theme/types';

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
}

export default function WorkoutScreen() {
  useScreenView('client_workout');
  const styles = useStyles();
  const { colors } = useTheme();
  const router = useRouter();
  const haptic = useHaptic();

  const { data: plan, isLoading, isError, refetch } = useWorkoutPlan('booking-1');

  const [seconds, setSeconds] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedSets, setCompletedSets] = useState<Record<number, number>>({});
  const [finished, setFinished] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const exercises: WorkoutExercise[] = plan?.exercises ?? [];
  const currentExercise = exercises[currentIndex];
  const currentSetsCompleted = completedSets[currentIndex] ?? 0;

  const handleSetDone = useCallback(() => {
    if (!currentExercise) return;
    haptic.medium();

    const newCompleted = currentSetsCompleted + 1;
    const updated = { ...completedSets, [currentIndex]: newCompleted };
    setCompletedSets(updated);

    if (newCompleted >= currentExercise.sets) {
      // All sets for this exercise done — move to next
      const nextIndex = currentIndex + 1;
      if (nextIndex >= exercises.length) {
        // All exercises done
        setFinished(true);
        if (timerRef.current) clearInterval(timerRef.current);
      } else {
        setCurrentIndex(nextIndex);
      }
    }
  }, [currentExercise, currentSetsCompleted, completedSets, currentIndex, exercises.length, haptic]);

  const handleFinish = useCallback(() => {
    Alert.alert('Завершить тренировку?', 'Прогресс будет потерян', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Завершить',
        style: 'destructive',
        onPress: () => {
          if (timerRef.current) clearInterval(timerRef.current);
          router.back();
        },
      },
    ]);
  }, [router]);

  const handleSave = useCallback(() => {
    haptic.medium();
    Alert.alert('Тренировка сохранена!', 'Отличная работа!', [
      { text: 'ОК', onPress: () => router.back() },
    ]);
  }, [haptic, router]);

  const totalVolume = exercises.reduce((sum, ex, idx) => {
    const sets = completedSets[idx] ?? 0;
    return sum + sets * (ex.reps ?? 0) * (ex.weight ?? 0);
  }, 0);

  const exercisesDone = exercises.filter((_, idx) => (completedSets[idx] ?? 0) >= _.sets).length;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={handleFinish} style={styles.closeBtn}>
            <Text style={styles.closeText}>{'×'}</Text>
          </Pressable>
          <View style={{ flex: 1 }} />
          <Text style={styles.timerText}>{'⏱'} {formatTime(seconds)}</Text>
        </View>
        <View style={styles.skeletonList}>
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !plan) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.closeBtn}>
            <Text style={styles.closeText}>{'×'}</Text>
          </Pressable>
          <View style={{ flex: 1 }} />
          <Text style={styles.timerText}>{'⏱'} {formatTime(seconds)}</Text>
        </View>
        <ErrorState message="Не удалось загрузить план тренировки" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  if (finished) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.completionContainer}>
          <Text style={styles.completionIcon}>{'✓'}</Text>
          <Text style={styles.completionTitle}>Тренировка завершена!</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{formatTime(seconds)}</Text>
              <Text style={styles.statLabel}>Время</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{exercises.length}</Text>
              <Text style={styles.statLabel}>Упражнений</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalVolume > 0 ? `${totalVolume} кг` : '—'}</Text>
              <Text style={styles.statLabel}>Общий объём</Text>
            </View>
          </View>

          <Button title="Сохранить" variant="primary" onPress={handleSave} style={styles.saveBtn} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={handleFinish} style={styles.closeBtn}>
          <Text style={styles.closeText}>{'× Завершить'}</Text>
        </Pressable>
        <View style={{ flex: 1 }} />
        <Text style={styles.timerText}>{'⏱'} {formatTime(seconds)}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current exercise card */}
        {currentExercise && (
          <View style={styles.currentCard}>
            <Text style={styles.currentName}>{currentExercise.name}</Text>
            <Text style={styles.currentSets}>
              Подход {currentSetsCompleted + 1} из {currentExercise.sets}
            </Text>

            {currentExercise.weight != null && currentExercise.weight > 0 && (
              <Text style={styles.weightDisplay}>
                {currentExercise.weight} <Text style={styles.weightUnit}>кг</Text>
              </Text>
            )}

            <Text style={styles.repsDisplay}>
              {currentExercise.reps} <Text style={styles.repsUnit}>повторений</Text>
            </Text>

            <Button
              title="✓ Подход готов"
              variant="primary"
              onPress={handleSetDone}
              style={styles.setDoneBtn}
            />
          </View>
        )}

        {/* Exercise plan list */}
        <Text style={styles.planTitle}>План тренировки</Text>
        {exercises.map((ex, idx) => {
          const setsCompleted = completedSets[idx] ?? 0;
          const isDone = setsCompleted >= ex.sets;
          const isActive = idx === currentIndex;
          const isPending = idx > currentIndex;

          return (
            <View
              key={ex.id}
              style={[
                styles.planItem,
                isActive && { borderColor: colors.accent.primary, borderWidth: 1 },
              ]}
            >
              <Text style={styles.planStatus}>
                {isDone ? '✅' : isActive ? '⏳' : '○'}
              </Text>
              <View style={styles.planContent}>
                <Text
                  style={[
                    styles.planName,
                    isDone && styles.planNameDone,
                    isPending && styles.planNamePending,
                  ]}
                  numberOfLines={1}
                >
                  {ex.name}
                </Text>
                <Text style={styles.planMeta}>
                  {ex.sets}×{ex.reps}{ex.weight ? ` · ${ex.weight} кг` : ''}
                </Text>
              </View>
              {isDone && (
                <Text style={styles.planCheck}>{setsCompleted}/{ex.sets}</Text>
              )}
            </View>
          );
        })}
      </ScrollView>
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
  closeBtn: {
    height: 40,
    borderRadius: t.radius.full,
    backgroundColor: t.colors.bg.elevated,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingHorizontal: SPACING[3],
  },
  closeText: { ...t.typography.bodySm, color: t.colors.text.primary, fontWeight: '600' as const },
  timerText: { ...t.typography.h4, color: t.colors.accent.primary },
  skeletonList: { padding: SPACING[4], gap: SPACING[3] },
  content: { padding: SPACING[4], gap: SPACING[4], paddingBottom: SPACING[6] },
  currentCard: {
    backgroundColor: t.colors.bg.elevated,
    borderRadius: t.radius.xl,
    padding: SPACING[5],
    alignItems: 'center' as const,
    gap: SPACING[2],
  },
  currentName: { ...t.typography.h2, color: t.colors.text.primary, textAlign: 'center' as const },
  currentSets: { ...t.typography.body, color: t.colors.text.secondary },
  weightDisplay: {
    fontSize: 48,
    fontWeight: '800' as const,
    color: t.colors.text.primary,
    marginTop: SPACING[2],
  },
  weightUnit: { fontSize: 24, fontWeight: '400' as const, color: t.colors.text.secondary },
  repsDisplay: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: t.colors.text.primary,
  },
  repsUnit: { fontSize: 18, fontWeight: '400' as const, color: t.colors.text.secondary },
  setDoneBtn: { width: '100%', marginTop: SPACING[3] },
  planTitle: { ...t.typography.h4, color: t.colors.text.primary },
  planItem: {
    flexDirection: 'row' as const,
    backgroundColor: t.colors.bg.elevated,
    borderRadius: t.radius.lg,
    padding: SPACING[4],
    gap: SPACING[3],
    alignItems: 'center' as const,
  },
  planStatus: { fontSize: 20 },
  planContent: { flex: 1, gap: SPACING[1] },
  planName: { ...t.typography.body, color: t.colors.text.primary, fontWeight: '500' as const },
  planNameDone: { textDecorationLine: 'line-through' as const, color: t.colors.text.tertiary },
  planNamePending: { color: t.colors.text.tertiary },
  planMeta: { ...t.typography.caption, color: t.colors.text.tertiary },
  planCheck: { ...t.typography.bodySm, color: t.colors.text.tertiary },
  completionContainer: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: SPACING[6],
    gap: SPACING[4],
  },
  completionIcon: {
    fontSize: 64,
    color: t.colors.accent.primary,
  },
  completionTitle: { ...t.typography.h2, color: t.colors.text.primary, textAlign: 'center' as const },
  statsGrid: {
    flexDirection: 'row' as const,
    gap: SPACING[4],
    marginTop: SPACING[4],
  },
  statItem: { alignItems: 'center' as const, gap: SPACING[1] },
  statValue: { ...t.typography.h3, color: t.colors.text.primary },
  statLabel: { ...t.typography.caption, color: t.colors.text.tertiary },
  saveBtn: { width: '100%', marginTop: SPACING[4] },
}));
