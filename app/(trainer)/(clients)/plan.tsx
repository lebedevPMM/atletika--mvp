import { useCallback } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { SPACING } from '@/shared/theme/types';
import { useScreenView } from '@/features/analytics/tracker';
import { useHaptic } from '@/shared/hooks/useHaptic';
import { useTrainerClientPlan } from '@/features/trainer/hooks';
import { Button, Card, Skeleton, ErrorState, EmptyState, Badge } from '@/shared/ui';
import type { TrainerPlanDay } from '@/features/trainer/types';

export default function TrainerClientPlanScreen() {
  useScreenView('trainer_client_plan');
  const styles = useStyles();
  const { colors } = useTheme();
  const router = useRouter();
  const haptic = useHaptic();

  const { clientId } = useLocalSearchParams<{ clientId: string }>();
  const resolvedClientId = clientId ?? 'client-1';
  const { data: plan, isLoading, isError, refetch } = useTrainerClientPlan(resolvedClientId);

  const handleEdit = useCallback(() => {
    haptic.medium();
    Alert.alert('Функция в разработке', 'Редактирование плана будет доступно в следующем обновлении');
  }, [haptic]);

  const handleSend = useCallback(() => {
    haptic.medium();
    Alert.alert('Отправлено', 'План тренировок отправлен клиенту');
  }, [haptic]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>{'←'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>План тренировок</Text>
        </View>
        <View style={styles.skeletonList}>
          <Skeleton variant="card" />
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </View>
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
          <Text style={styles.headerTitle}>План тренировок</Text>
        </View>
        <ErrorState message="Не удалось загрузить план" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  if (!plan) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>{'←'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>План тренировок</Text>
        </View>
        <EmptyState
          icon={'\uD83D\uDCCB'}
          title="Нет плана"
          subtitle="Создайте план тренировок для клиента"
          actionTitle="Создать план"
          onAction={handleEdit}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>{'←'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>План тренировок</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Client + Plan info */}
        <Card style={styles.infoCard}>
          <Text style={styles.clientName}>{plan.clientName}</Text>
          <View style={styles.metaRow}>
            <Badge text={plan.period} variant="info" />
            <Badge text={plan.frequency} variant="success" />
          </View>
        </Card>

        {/* Days */}
        {plan.days.map((day: TrainerPlanDay) => (
          <Card key={day.day} style={styles.dayCard}>
            <View style={styles.dayHeader}>
              <View style={[styles.dayBadge, { backgroundColor: colors.accent.primary }]}>
                <Text style={styles.dayBadgeText}>{day.day}</Text>
              </View>
              <Text style={styles.dayTitle}>{day.title}</Text>
            </View>
            <View style={styles.exerciseList}>
              {day.exercises.map((ex, idx) => (
                <View key={idx} style={styles.exerciseRow}>
                  <Text style={styles.exerciseDot}>{'\u2022'}</Text>
                  <Text style={styles.exerciseText}>{ex}</Text>
                </View>
              ))}
            </View>
          </Card>
        ))}

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Редактировать план"
            variant="secondary"
            onPress={handleEdit}
          />
          <Button
            title="Отправить клиенту"
            variant="primary"
            onPress={handleSend}
          />
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
  infoCard: { gap: SPACING[3] },
  clientName: { ...t.typography.h3, color: t.colors.text.primary },
  metaRow: { flexDirection: 'row' as const, gap: SPACING[2] },
  dayCard: { gap: SPACING[3] },
  dayHeader: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: SPACING[3] },
  dayBadge: {
    width: 36, height: 36, borderRadius: t.radius.md,
    alignItems: 'center' as const, justifyContent: 'center' as const,
  },
  dayBadgeText: { ...t.typography.bodySm, color: t.colors.text.inverse, fontWeight: '700' as const },
  dayTitle: { ...t.typography.bodyLg, color: t.colors.text.primary, fontWeight: '600' as const },
  exerciseList: { gap: SPACING[2], paddingLeft: SPACING[1] },
  exerciseRow: { flexDirection: 'row' as const, gap: SPACING[2], alignItems: 'flex-start' as const },
  exerciseDot: { ...t.typography.body, color: t.colors.text.tertiary, lineHeight: 22 },
  exerciseText: { ...t.typography.body, color: t.colors.text.primary, flex: 1 },
  actions: { gap: SPACING[3], marginTop: SPACING[2] },
}));
