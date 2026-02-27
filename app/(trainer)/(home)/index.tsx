import { useCallback, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { SPACING } from '@/shared/theme/types';
import { useTimeOfDay } from '@/shared/hooks/useTimeOfDay';
import { useScreenView } from '@/features/analytics/tracker';
import { useAuthStore } from '@/features/auth/store';
import { useDayOverview } from '@/features/trainer/hooks';
import { getSessionTypeShort, getSessionBadgeVariant } from '@/features/trainer/utils';
import { Card, Badge, Skeleton, ErrorState } from '@/shared/ui';
import type { TrainerSession } from '@/features/trainer/types';

function getGreeting(tod: ReturnType<typeof useTimeOfDay>): string {
  switch (tod) {
    case 'morning':
      return 'Доброе утро';
    case 'day':
      return 'Добрый день';
    case 'evening':
      return 'Добрый вечер';
    case 'night':
      return 'Доброй ночи';
  }
}

export default function TrainerHomeScreen() {
  useScreenView('trainer_home');

  const router = useRouter();
  const styles = useStyles();
  const { colors } = useTheme();
  const tod = useTimeOfDay();
  const user = useAuthStore((s) => s.user);
  const { data, isLoading, isError, refetch } = useDayOverview();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const greeting = `${getGreeting(tod)}, ${user?.firstName ?? ''}!`;

  const handleSessionPress = (sessionId: string) => {
    router.push(`/(trainer)/(schedule)/${sessionId}`);
  };

  if (isError) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ErrorState message="Не удалось загрузить данные" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>{greeting}</Text>
        </View>

        {/* Stats card */}
        {isLoading ? (
          <View style={styles.statsCard}>
            <Skeleton variant="list" />
          </View>
        ) : data ? (
          <Card style={styles.statsCard}>
            <Text style={styles.statsTitle}>Сегодня</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{data.sessionsCount}</Text>
                <Text style={styles.statLabel}>Занятий</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{data.clientsCount}</Text>
                <Text style={styles.statLabel}>Клиентов</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{data.hoursCount}</Text>
                <Text style={styles.statLabel}>Часов</Text>
              </View>
            </View>
          </Card>
        ) : null}

        {/* Upcoming sessions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ближайшие занятия</Text>
          {isLoading ? (
            <View style={styles.sessionsList}>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} variant="list" />
              ))}
            </View>
          ) : data?.upcomingSessions.length ? (
            <View style={styles.sessionsList}>
              {data.upcomingSessions
                .filter((s) => s.status !== 'completed' && s.status !== 'cancelled')
                .slice(0, 4)
                .map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onPress={() => handleSessionPress(session.id)}
                  />
                ))}
            </View>
          ) : (
            <Card>
              <Text style={styles.emptyText}>Нет предстоящих занятий</Text>
            </Card>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SessionCard({ session, onPress }: { session: TrainerSession; onPress: () => void }) {
  const styles = useStyles();
  const { colors } = useTheme();

  const stripeColor =
    session.type === 'pt' ? colors.accent.primary :
    session.type === 'group' ? colors.semantic.info.main :
    colors.semantic.warning.main;

  return (
    <Card onPress={onPress} style={styles.sessionCard}>
      <View style={styles.sessionRow}>
        <View style={[styles.sessionStripe, { backgroundColor: stripeColor }]} />
        <View style={styles.sessionTime}>
          <Text style={styles.sessionTimeText}>{session.time}</Text>
          <Text style={styles.sessionEndTime}>{session.endTime}</Text>
        </View>
        <View style={styles.sessionInfo}>
          <View style={styles.sessionTitleRow}>
            <Text style={styles.sessionTitle} numberOfLines={1}>
              {session.title}
            </Text>
            <Badge
              text={getSessionTypeShort(session.type)}
              variant={getSessionBadgeVariant(session.type)}
            />
          </View>
          <Text style={styles.sessionMeta} numberOfLines={1}>
            {session.type === 'pt'
              ? session.clientName
              : `${session.attendeeCount ?? 0} из ${session.maxAttendees ?? 0}`}
          </Text>
          <Text style={styles.sessionLocation}>{session.location}</Text>
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
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: SPACING[10],
  },
  header: {
    paddingHorizontal: SPACING[4],
    paddingTop: SPACING[4],
    paddingBottom: SPACING[3],
  },
  greeting: {
    ...t.typography.h2,
    color: t.colors.text.primary,
  },
  statsCard: {
    marginHorizontal: SPACING[4],
    marginBottom: SPACING[4],
  },
  statsTitle: {
    ...t.typography.h4,
    color: t.colors.text.primary,
    marginBottom: SPACING[3],
  },
  statsRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-around' as const,
  },
  statItem: {
    alignItems: 'center' as const,
    flex: 1,
  },
  statValue: {
    ...t.typography.dataLg,
    color: t.colors.accent.primary,
  },
  statLabel: {
    ...t.typography.caption,
    color: t.colors.text.secondary,
    marginTop: SPACING[1],
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: t.colors.border.default,
  },
  section: {
    paddingHorizontal: SPACING[4],
  },
  sectionTitle: {
    ...t.typography.h4,
    color: t.colors.text.primary,
    marginBottom: SPACING[3],
  },
  sessionsList: {
    gap: SPACING[2],
  },
  sessionCard: {
    padding: 0,
    overflow: 'hidden' as const,
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
  sessionEndTime: {
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
  emptyText: {
    ...t.typography.body,
    color: t.colors.text.secondary,
    textAlign: 'center' as const,
  },
}));
