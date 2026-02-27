import { useState, useCallback, useMemo } from 'react';
import { View, Text, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Card, Button, Badge, Skeleton, ErrorState } from '@/shared/ui';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { useHaptic } from '@/shared/hooks/useHaptic';
import { useScreenView } from '@/features/analytics/tracker';
import { useFreezeRules, useFreezeHistory, useRequestFreeze } from '@/features/membership/hooks';
import { SPACING } from '@/shared/theme/types';

export default function FreezeScreen() {
  useScreenView('client_freeze');
  const styles = useStyles();
  const { colors } = useTheme();
  const router = useRouter();
  const haptic = useHaptic();

  const { data: rules, isLoading: rulesLoading, isError: rulesError, refetch } = useFreezeRules();
  const { data: history } = useFreezeHistory();
  const requestFreeze = useRequestFreeze();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Generate dates for next 60 days
  const availableDates = useMemo(() => {
    const dates: { date: string; label: string }[] = [];
    const now = new Date();
    for (let i = 1; i <= 60; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() + i);
      dates.push({
        date: d.toISOString().split('T')[0],
        label: d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
      });
    }
    return dates;
  }, []);

  const selectedDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const ms = new Date(endDate).getTime() - new Date(startDate).getTime();
    return Math.max(0, Math.ceil(ms / 86_400_000) + 1);
  }, [startDate, endDate]);

  const canFreeze = rules && selectedDays >= (rules.minPeriodDays ?? 1) &&
    selectedDays <= (rules.maxDays - rules.freezeDaysUsed) &&
    rules.freezesUsed < rules.maxTimesPerYear;

  const handleFreeze = useCallback(async () => {
    if (!canFreeze) return;
    haptic.selection();
    Alert.alert(
      'Подтвердить заморозку?',
      `Абонемент будет заморожен на ${selectedDays} дн. (${startDate} — ${endDate})`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Заморозить',
          onPress: async () => {
            try {
              await requestFreeze.mutateAsync({ startDate, endDate });
              haptic.success();
              Alert.alert('Готово', 'Абонемент заморожен', [
                { text: 'OK', onPress: () => router.back() },
              ]);
            } catch {
              haptic.error();
              Alert.alert('Ошибка', 'Не удалось заморозить абонемент');
            }
          },
        },
      ],
    );
  }, [canFreeze, selectedDays, startDate, endDate, requestFreeze, haptic, router]);

  if (rulesLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>{'←'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Заморозка</Text>
        </View>
        <View style={styles.skeletonList}><Skeleton variant="card" /><Skeleton variant="card" /></View>
      </SafeAreaView>
    );
  }

  if (rulesError || !rules) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>{'←'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Заморозка</Text>
        </View>
        <ErrorState message="Не удалось загрузить правила" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  const daysRemaining = rules.maxDays - rules.freezeDaysUsed;
  const freezesRemaining = rules.maxTimesPerYear - rules.freezesUsed;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>{'←'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Заморозка</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Rules summary */}
        <Card style={styles.rulesCard}>
          <Text style={styles.rulesTitle}>Правила заморозки</Text>
          <View style={styles.rulesGrid}>
            <View style={styles.ruleItem}>
              <Text style={styles.ruleValue}>{daysRemaining}</Text>
              <Text style={styles.ruleLabel}>дней осталось</Text>
            </View>
            <View style={styles.ruleItem}>
              <Text style={styles.ruleValue}>{freezesRemaining}</Text>
              <Text style={styles.ruleLabel}>раз в году</Text>
            </View>
            <View style={styles.ruleItem}>
              <Text style={styles.ruleValue}>{rules.minPeriodDays}+</Text>
              <Text style={styles.ruleLabel}>мин. дней</Text>
            </View>
          </View>
        </Card>

        {/* Date selection */}
        <Text style={styles.sectionTitle}>Дата начала</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateRow}>
          {availableDates.slice(0, 30).map((d) => (
            <Pressable
              key={d.date}
              onPress={() => { haptic.selection(); setStartDate(d.date); if (!endDate || d.date > endDate) setEndDate(''); }}
              style={[styles.dateChip, startDate === d.date && { backgroundColor: colors.accent.primary }]}
            >
              <Text style={[styles.dateChipText, startDate === d.date && { color: colors.text.inverse }]}>{d.label}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {startDate !== '' && (
          <>
            <Text style={styles.sectionTitle}>Дата окончания</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateRow}>
              {availableDates
                .filter((d) => d.date >= startDate)
                .slice(0, 30)
                .map((d) => (
                  <Pressable
                    key={d.date}
                    onPress={() => { haptic.selection(); setEndDate(d.date); }}
                    style={[styles.dateChip, endDate === d.date && { backgroundColor: colors.accent.primary }]}
                  >
                    <Text style={[styles.dateChipText, endDate === d.date && { color: colors.text.inverse }]}>{d.label}</Text>
                  </Pressable>
                ))}
            </ScrollView>
          </>
        )}

        {selectedDays > 0 && (
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryText}>Период: {selectedDays} дн.</Text>
          </Card>
        )}

        {/* History */}
        {(history ?? []).length > 0 && (
          <>
            <Text style={styles.sectionTitle}>История заморозок</Text>
            {(history ?? []).map((fr) => (
              <Card key={fr.id} style={styles.historyCard}>
                <View style={styles.historyRow}>
                  <Text style={styles.historyDates}>{fr.startDate} — {fr.endDate}</Text>
                  <Badge text={fr.status === 'active' ? 'Активна' : fr.status === 'completed' ? 'Завершена' : 'Отменена'}
                    variant={fr.status === 'active' ? 'accent' : fr.status === 'completed' ? 'success' : 'error'} />
                </View>
                <Text style={styles.historyDays}>{fr.days} дн.</Text>
              </Card>
            ))}
          </>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <Button
          title="Заморозить абонемент"
          onPress={handleFreeze}
          disabled={!canFreeze}
          loading={requestFreeze.isPending}
        />
      </View>
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
  scroll: { flex: 1 },
  scrollContent: { padding: SPACING[4], gap: SPACING[4], paddingBottom: SPACING[6] },
  skeletonList: { padding: SPACING[4], gap: SPACING[3] },
  rulesCard: { padding: SPACING[4], gap: SPACING[3] },
  rulesTitle: { ...t.typography.h4, color: t.colors.text.primary },
  rulesGrid: { flexDirection: 'row' as const, justifyContent: 'space-around' as const },
  ruleItem: { alignItems: 'center' as const, gap: SPACING[1] },
  ruleValue: { ...t.typography.h3, color: t.colors.accent.primary },
  ruleLabel: { ...t.typography.caption, color: t.colors.text.tertiary },
  sectionTitle: { ...t.typography.h4, color: t.colors.text.primary },
  dateRow: { gap: SPACING[2], paddingVertical: SPACING[1] },
  dateChip: {
    paddingHorizontal: SPACING[3], paddingVertical: SPACING[2],
    borderRadius: t.radius.lg, backgroundColor: t.colors.bg.elevated,
    borderWidth: 1, borderColor: t.colors.border.default,
  },
  dateChipText: { ...t.typography.bodySm, color: t.colors.text.primary },
  summaryCard: { padding: SPACING[4], alignItems: 'center' as const },
  summaryText: { ...t.typography.body, color: t.colors.text.primary, fontWeight: '600' as const },
  historyCard: { padding: SPACING[4], gap: SPACING[2] },
  historyRow: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const },
  historyDates: { ...t.typography.body, color: t.colors.text.primary },
  historyDays: { ...t.typography.caption, color: t.colors.text.tertiary },
  bottomBar: { paddingHorizontal: SPACING[4], paddingVertical: SPACING[3], borderTopWidth: 1, borderTopColor: t.colors.border.default },
}));
