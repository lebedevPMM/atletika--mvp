import { useCallback, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { useTimeOfDay } from '@/shared/hooks/useTimeOfDay';
import { useScreenView } from '@/features/analytics/tracker';
import { useAuthStore } from '@/features/auth/store';
import { useClubStore } from '@/features/club/store';
import { useDashboard } from '@/features/home/hooks';
import { NextBookingTile } from '@/features/home/tiles/NextBookingTile';
import { MembershipTile } from '@/features/home/tiles/MembershipTile';
import { BillingTile } from '@/features/home/tiles/BillingTile';
import { BonusTile } from '@/features/home/tiles/BonusTile';
import { PromoCard } from '@/features/home/tiles/PromoCard';
import { SPACING } from '@/shared/theme/types';

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

export default function HomeScreen() {
  useScreenView('client_home');
  const styles = useStyles();
  const { colors } = useTheme();
  const tod = useTimeOfDay();
  const user = useAuthStore((s) => s.user);
  const clubName = useClubStore((s) => s.clubName);
  const { data, isLoading, refetch } = useDashboard();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const greeting = `${getGreeting(tod)}, ${user?.firstName ?? ''}!`;

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
          <View style={styles.headerText}>
            <Text style={styles.greeting}>{greeting}</Text>
            {clubName ? (
              <Text style={styles.clubName}>{clubName}</Text>
            ) : null}
          </View>
          <Pressable style={styles.bellBtn} accessibilityLabel="Уведомления">
            <Text style={styles.bellIcon}>🔔</Text>
          </Pressable>
        </View>

        {/* Tiles grid */}
        <View style={styles.grid}>
          <NextBookingTile data={data?.nextBooking ?? null} isLoading={isLoading} />
          <MembershipTile data={data?.membership ?? null} isLoading={isLoading} />
          <BillingTile data={data?.billing ?? null} isLoading={isLoading} />
          <BonusTile data={data?.bonus ?? null} isLoading={isLoading} />
        </View>

        {/* Promos */}
        {(data?.promos?.length ?? 0) > 0 && (
          <View style={styles.promosSection}>
            <Text style={styles.promosTitle}>Акции</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.promosScroll}
            >
              {data!.promos.map((promo) => (
                <PromoCard key={promo.id} data={promo} />
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
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
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: SPACING[4],
    paddingTop: SPACING[4],
    paddingBottom: SPACING[3],
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    ...t.typography.h2,
    color: t.colors.text.primary,
  },
  clubName: {
    ...t.typography.bodySm,
    color: t.colors.text.secondary,
    marginTop: SPACING[1],
  },
  bellBtn: {
    width: 44,
    height: 44,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  bellIcon: {
    fontSize: 24,
  },
  grid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    paddingHorizontal: SPACING[4],
    gap: SPACING[3],
  },
  promosSection: {
    marginTop: SPACING[6],
  },
  promosTitle: {
    ...t.typography.h4,
    color: t.colors.text.primary,
    paddingHorizontal: SPACING[4],
    marginBottom: SPACING[3],
  },
  promosScroll: {
    paddingHorizontal: SPACING[4],
    gap: SPACING[3],
  },
}));
