import { useState, useCallback } from 'react';
import { View, Text, Pressable, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Badge, Skeleton, ErrorState, EmptyState } from '@/shared/ui';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { useScreenView } from '@/features/analytics/tracker';
import { useClubTeam } from '@/features/club/hooks';
import { getRoleLabel, getRoleBadgeVariant, formatRating } from '@/features/club/utils';
import { getInitials } from '@/features/club/utils';
import { SPACING } from '@/shared/theme/types';
import type { TeamMember } from '@/features/club/types';

const ROLE_FILTERS = [
  { key: undefined, label: 'Все' },
  { key: 'trainer', label: 'Тренеры' },
  { key: 'instructor', label: 'Инструкторы' },
  { key: 'spa', label: 'SPA' },
] as const;

export default function ClubTeamScreen() {
  useScreenView('client_club_team');
  const styles = useStyles();
  const { colors } = useTheme();
  const router = useRouter();

  const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);
  const { data: team, isLoading, isError, refetch, isRefetching } = useClubTeam(roleFilter);

  const handleMemberPress = useCallback(
    (memberId: string) => {
      router.push(`/(client)/(more)/club/trainer/${memberId}`);
    },
    [router],
  );

  const renderMember = useCallback(
    ({ item }: { item: TeamMember }) => (
      <Pressable
        onPress={() => handleMemberPress(item.id)}
        style={({ pressed }) => [styles.memberCard, pressed && styles.memberCardPressed]}
      >
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
        </View>
        <View style={styles.memberInfo}>
          <Text style={styles.memberName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.memberSpec} numberOfLines={1}>{item.specialization}</Text>
          <View style={styles.memberMeta}>
            <Badge text={getRoleLabel(item.role)} variant={getRoleBadgeVariant(item.role)} />
            <Text style={styles.memberRating}>{'★ '}{formatRating(item.rating)}</Text>
          </View>
        </View>
        <Text style={styles.arrow}>{'→'}</Text>
      </Pressable>
    ),
    [handleMemberPress, styles],
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>{'←'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Команда</Text>
        </View>
        <View style={styles.skeletonList}>
          <Skeleton variant="card" /><Skeleton variant="card" /><Skeleton variant="card" />
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
          <Text style={styles.headerTitle}>Команда</Text>
        </View>
        <ErrorState message="Не удалось загрузить команду" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>{'←'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Команда</Text>
      </View>

      {/* Role filter chips */}
      <View style={styles.filterRow}>
        {ROLE_FILTERS.map((f) => {
          const isActive = roleFilter === f.key;
          return (
            <Pressable
              key={f.label}
              onPress={() => setRoleFilter(f.key)}
              style={[styles.filterChip, isActive && { backgroundColor: colors.accent.primary }]}
            >
              <Text style={[styles.filterChipText, isActive && { color: colors.text.inverse }]}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={team ?? []}
        keyExtractor={(item) => item.id}
        renderItem={renderMember}
        contentContainerStyle={[
          styles.listContent,
          (team ?? []).length === 0 && styles.emptyContainer,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.accent.primary} />
        }
        ListEmptyComponent={<EmptyState icon="👥" title="Нет сотрудников" subtitle="Попробуйте другой фильтр" />}
      />
    </SafeAreaView>
  );
}

const useStyles = createStyles((t) => ({
  safe: {
    flex: 1,
    backgroundColor: t.colors.bg.primary,
  },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: SPACING[4],
    paddingTop: SPACING[2],
    paddingBottom: SPACING[3],
    gap: SPACING[3],
  },
  headerTitle: {
    ...t.typography.h3,
    color: t.colors.text.primary,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: t.radius.full,
    backgroundColor: t.colors.bg.elevated,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  backText: {
    fontSize: 20,
    color: t.colors.text.primary,
  },
  filterRow: {
    flexDirection: 'row' as const,
    paddingHorizontal: SPACING[4],
    paddingBottom: SPACING[3],
    gap: SPACING[2],
  },
  filterChip: {
    paddingHorizontal: SPACING[4],
    paddingVertical: SPACING[2],
    borderRadius: t.radius.lg,
    backgroundColor: t.colors.bg.elevated,
    borderWidth: 1,
    borderColor: t.colors.border.default,
  },
  filterChipText: {
    ...t.typography.bodySm,
    color: t.colors.text.primary,
  },
  skeletonList: {
    padding: SPACING[4],
    gap: SPACING[3],
  },
  listContent: {
    paddingHorizontal: SPACING[4],
    paddingBottom: SPACING[6],
    gap: SPACING[3],
  },
  emptyContainer: {
    flex: 1,
  },
  memberCard: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: t.colors.bg.elevated,
    borderRadius: t.radius.lg,
    padding: SPACING[4],
    gap: SPACING[3],
  },
  memberCardPressed: {
    opacity: 0.85,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: t.radius.full,
    backgroundColor: t.colors.accent.surface,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  avatarText: {
    ...t.typography.body,
    color: t.colors.accent.primary,
    fontWeight: '600' as const,
  },
  memberInfo: {
    flex: 1,
    gap: SPACING[1],
  },
  memberName: {
    ...t.typography.body,
    color: t.colors.text.primary,
    fontWeight: '600' as const,
  },
  memberSpec: {
    ...t.typography.bodySm,
    color: t.colors.text.secondary,
  },
  memberMeta: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: SPACING[2],
    marginTop: SPACING[1],
  },
  memberRating: {
    ...t.typography.caption,
    color: t.colors.semantic.warning.main,
  },
  arrow: {
    ...t.typography.body,
    color: t.colors.text.tertiary,
  },
}));
