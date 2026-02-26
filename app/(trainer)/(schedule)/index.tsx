import { useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, RefreshControl, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { SPACING } from '@/shared/theme/types';
import { useScreenView } from '@/features/analytics/tracker';
import { useTrainerSchedule } from '@/features/trainer/hooks';
import { Card, Badge, SegmentedControl, Skeleton } from '@/shared/ui';
import { CaretLeft, CaretRight } from 'phosphor-react-native';
import type { TrainerSession } from '@/features/trainer/types';

const SEGMENTS = ['День', 'Неделя'];
const DAY_NAMES_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const MONTH_NAMES = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
];

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function formatDateDisplay(date: Date): string {
  const day = date.getDate();
  const month = MONTH_NAMES[date.getMonth()];
  const dayOfWeek = getDayOfWeekName(date);
  return `${dayOfWeek}, ${day} ${month}`;
}

function getDayOfWeekName(date: Date): string {
  const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
  return days[date.getDay()];
}

function getWeekDays(date: Date): Date[] {
  const d = new Date(date);
  const dayOfWeek = d.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Monday start
  const monday = new Date(d);
  monday.setDate(d.getDate() + diff);

  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    return day;
  });
}

function isToday(date: Date): boolean {
  const now = new Date();
  return date.toDateString() === now.toDateString();
}

function getSessionTypeLabel(type: TrainerSession['type']): string {
  switch (type) {
    case 'pt': return 'ПТ';
    case 'group': return 'Групповое';
    case 'spa': return 'СПА';
  }
}

function getSessionBadgeVariant(type: TrainerSession['type']): 'accent' | 'info' | 'warning' {
  switch (type) {
    case 'pt': return 'accent';
    case 'group': return 'info';
    case 'spa': return 'warning';
  }
}

export default function TrainerScheduleScreen() {
  useScreenView('trainer_schedule');

  const router = useRouter();
  const styles = useStyles();
  const { colors } = useTheme();

  const [viewIndex, setViewIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate]);
  const dateStr = formatDate(selectedDate);

  const weekFrom = formatDate(weekDays[0]);
  const weekTo = formatDate(weekDays[6]);

  const { data: sessions, isLoading, refetch } = useTrainerSchedule(weekFrom, weekTo);

  const daySessionsMap = useMemo(() => {
    const map: Record<string, TrainerSession[]> = {};
    if (sessions) {
      // In mock mode, all sessions belong to the selected day
      // In real mode, sessions would have date info
      for (const day of weekDays) {
        map[formatDate(day)] = sessions;
      }
    }
    return map;
  }, [sessions, weekDays]);

  const todaySessions = sessions ?? [];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const goToPrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d);
  };

  const goToNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d);
  };

  const goToPrevWeek = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 7);
    setSelectedDate(d);
  };

  const goToNextWeek = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 7);
    setSelectedDate(d);
  };

  const handleSessionPress = (sessionId: string) => {
    router.push(`/(trainer)/(schedule)/${sessionId}`);
  };

  const handleWeekDayPress = (date: Date) => {
    setSelectedDate(date);
    setViewIndex(0); // switch to day view
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.headerSection}>
        <Text style={styles.screenTitle}>Расписание</Text>
        <SegmentedControl
          segments={SEGMENTS}
          selectedIndex={viewIndex}
          onSelect={setViewIndex}
        />
      </View>

      {viewIndex === 0 ? (
        /* Day view */
        <>
          <View style={styles.dateNav}>
            <Pressable onPress={goToPrevDay} style={styles.navBtn}>
              <CaretLeft size={24} color={colors.text.primary} />
            </Pressable>
            <Text style={styles.dateText}>{formatDateDisplay(selectedDate)}</Text>
            <Pressable onPress={goToNextDay} style={styles.navBtn}>
              <CaretRight size={24} color={colors.text.primary} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.accent.primary}
              />
            }
          >
            {isLoading ? (
              <View style={styles.sessionsList}>
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} variant="list" />
                ))}
              </View>
            ) : todaySessions.length > 0 ? (
              <View style={styles.sessionsList}>
                {todaySessions.map((session) => (
                  <ScheduleSessionCard
                    key={session.id}
                    session={session}
                    onPress={() => handleSessionPress(session.id)}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>📅</Text>
                <Text style={styles.emptyTitle}>Нет занятий</Text>
                <Text style={styles.emptySubtitle}>На этот день нет запланированных занятий</Text>
              </View>
            )}
          </ScrollView>
        </>
      ) : (
        /* Week view */
        <>
          <View style={styles.dateNav}>
            <Pressable onPress={goToPrevWeek} style={styles.navBtn}>
              <CaretLeft size={24} color={colors.text.primary} />
            </Pressable>
            <Text style={styles.dateText}>
              {weekDays[0].getDate()} - {weekDays[6].getDate()} {MONTH_NAMES[weekDays[6].getMonth()]}
            </Text>
            <Pressable onPress={goToNextWeek} style={styles.navBtn}>
              <CaretRight size={24} color={colors.text.primary} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.accent.primary}
              />
            }
          >
            <View style={styles.weekGrid}>
              {weekDays.map((day, index) => {
                const dayStr = formatDate(day);
                const daySessions = daySessionsMap[dayStr] ?? [];
                const isTodayDate = isToday(day);

                return (
                  <Pressable
                    key={dayStr}
                    style={[styles.weekDay, isTodayDate && styles.weekDayToday]}
                    onPress={() => handleWeekDayPress(day)}
                  >
                    <Text style={[styles.weekDayName, isTodayDate && styles.weekDayNameToday]}>
                      {DAY_NAMES_SHORT[index]}
                    </Text>
                    <Text style={[styles.weekDayDate, isTodayDate && styles.weekDayDateToday]}>
                      {day.getDate()}
                    </Text>
                    <View style={styles.weekDayDots}>
                      {daySessions.slice(0, 3).map((s, i) => {
                        const dotColor =
                          s.type === 'pt' ? colors.accent.primary :
                          s.type === 'group' ? colors.semantic.info.main :
                          colors.semantic.warning.main;
                        return (
                          <View
                            key={i}
                            style={[styles.sessionDot, { backgroundColor: dotColor }]}
                          />
                        );
                      })}
                    </View>
                    <Text style={styles.weekDayCount}>
                      {daySessions.length > 0 ? `${daySessions.length} зан.` : ''}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}

function ScheduleSessionCard({ session, onPress }: { session: TrainerSession; onPress: () => void }) {
  const styles = useStyles();
  const { colors } = useTheme();

  const stripeColor =
    session.type === 'pt' ? colors.accent.primary :
    session.type === 'group' ? colors.semantic.info.main :
    colors.semantic.warning.main;

  const isCompleted = session.status === 'completed';
  const isCancelled = session.status === 'cancelled';

  return (
    <Card onPress={onPress} style={(isCompleted || isCancelled) ? { ...styles.sessionCard, ...styles.sessionCardDimmed } : styles.sessionCard}>
      <View style={styles.sessionRow}>
        <View style={[styles.sessionStripe, { backgroundColor: stripeColor }]} />
        <View style={styles.sessionTime}>
          <Text style={styles.sessionTimeText}>{session.time}</Text>
          <Text style={styles.sessionEndTimeText}>{session.endTime}</Text>
        </View>
        <View style={styles.sessionInfo}>
          <View style={styles.sessionTitleRow}>
            <Text style={styles.sessionTitle} numberOfLines={1}>
              {session.title}
            </Text>
            <Badge
              text={getSessionTypeLabel(session.type)}
              variant={getSessionBadgeVariant(session.type)}
            />
          </View>
          <Text style={styles.sessionMeta} numberOfLines={1}>
            {session.type === 'pt'
              ? session.clientName
              : `${session.attendeeCount ?? 0} из ${session.maxAttendees ?? 0}`}
          </Text>
          <Text style={styles.sessionLocation}>{session.location}</Text>
          {isCompleted && <Text style={styles.statusDone}>Завершено</Text>}
          {isCancelled && <Text style={styles.statusCancelled}>Отменено</Text>}
        </View>
      </View>
    </Card>
  );
}

const useStyles = createStyles((t) => ({
  safe: {
    flex: 1,
    backgroundColor: t.colors.bg.primary,
  },
  headerSection: {
    paddingHorizontal: SPACING[4],
    paddingTop: SPACING[4],
    gap: SPACING[3],
  },
  screenTitle: {
    ...t.typography.h2,
    color: t.colors.text.primary,
  },
  dateNav: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: SPACING[4],
    paddingVertical: SPACING[3],
  },
  navBtn: {
    width: 44,
    height: 44,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  dateText: {
    ...t.typography.bodyLg,
    color: t.colors.text.primary,
    fontWeight: '600' as const,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING[4],
    paddingBottom: SPACING[10],
  },
  sessionsList: {
    gap: SPACING[2],
  },
  sessionCard: {
    padding: 0,
    overflow: 'hidden' as const,
  },
  sessionCardDimmed: {
    opacity: 0.6,
  },
  sessionRow: {
    flexDirection: 'row' as const,
    alignItems: 'stretch' as const,
  },
  sessionStripe: {
    width: 4,
  },
  sessionTime: {
    width: 56,
    paddingVertical: SPACING[3],
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  sessionTimeText: {
    ...t.typography.data,
    color: t.colors.text.primary,
  },
  sessionEndTimeText: {
    ...t.typography.caption,
    color: t.colors.text.tertiary,
  },
  sessionInfo: {
    flex: 1,
    paddingVertical: SPACING[3],
    paddingRight: SPACING[3],
    gap: SPACING[1],
  },
  sessionTitleRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    gap: SPACING[2],
  },
  sessionTitle: {
    ...t.typography.bodySm,
    color: t.colors.text.primary,
    fontWeight: '600' as const,
    flex: 1,
  },
  sessionMeta: {
    ...t.typography.caption,
    color: t.colors.text.secondary,
  },
  sessionLocation: {
    ...t.typography.caption,
    color: t.colors.text.tertiary,
  },
  statusDone: {
    ...t.typography.caption,
    color: t.colors.semantic.success.main,
    fontWeight: '500' as const,
  },
  statusCancelled: {
    ...t.typography.caption,
    color: t.colors.semantic.error.main,
    fontWeight: '500' as const,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: SPACING[16],
    gap: SPACING[2],
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    ...t.typography.h3,
    color: t.colors.text.primary,
  },
  emptySubtitle: {
    ...t.typography.body,
    color: t.colors.text.secondary,
    textAlign: 'center' as const,
  },
  // Week view
  weekGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: SPACING[2],
  },
  weekDay: {
    flex: 1,
    minWidth: '13%' as unknown as number,
    backgroundColor: t.colors.bg.elevated,
    borderRadius: t.radius.lg,
    paddingVertical: SPACING[3],
    paddingHorizontal: SPACING[1],
    alignItems: 'center' as const,
    gap: SPACING[1],
  },
  weekDayToday: {
    borderWidth: 2,
    borderColor: t.colors.accent.primary,
  },
  weekDayName: {
    ...t.typography.caption,
    color: t.colors.text.secondary,
    fontWeight: '600' as const,
  },
  weekDayNameToday: {
    color: t.colors.accent.primary,
  },
  weekDayDate: {
    ...t.typography.bodyLg,
    color: t.colors.text.primary,
    fontWeight: '700' as const,
  },
  weekDayDateToday: {
    color: t.colors.accent.primary,
  },
  weekDayDots: {
    flexDirection: 'row' as const,
    gap: 3,
    height: 8,
    alignItems: 'center' as const,
  },
  sessionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  weekDayCount: {
    ...t.typography.caption,
    color: t.colors.text.tertiary,
    fontSize: 10,
  },
}));
