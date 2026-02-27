import { useCallback } from 'react';
import { View, Text, Pressable, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Badge, Skeleton, ErrorState, EmptyState } from '@/shared/ui';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { useScreenView } from '@/features/analytics/tracker';
import { useFamily } from '@/features/health/hooks';
import { getRelationshipLabel } from '@/features/health/utils';
import { getInitials } from '@/features/club/utils';
import { SPACING } from '@/shared/theme/types';
import type { FamilyMember } from '@/features/health/types';

function getMemberStatusLabel(status: FamilyMember['membershipStatus']): string {
  switch (status) {
    case 'active': return 'Активен';
    case 'expired': return 'Истёк';
    case 'none': return 'Нет абонемента';
    default: return status;
  }
}

function getMemberStatusVariant(status: FamilyMember['membershipStatus']): 'success' | 'error' | 'warning' {
  switch (status) {
    case 'active': return 'success';
    case 'expired': return 'error';
    case 'none': return 'warning';
    default: return 'warning';
  }
}

export default function FamilyScreen() {
  useScreenView('client_family');
  const styles = useStyles();
  const { colors } = useTheme();
  const router = useRouter();

  const { data: members, isLoading, isError, refetch, isRefetching } = useFamily();

  const renderMember = useCallback(
    ({ item }: { item: FamilyMember }) => (
      <View style={styles.memberCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
        </View>
        <View style={styles.memberInfo}>
          <Text style={styles.memberName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.memberRel}>{getRelationshipLabel(item.relationship)}</Text>
        </View>
        <Badge text={getMemberStatusLabel(item.membershipStatus)} variant={getMemberStatusVariant(item.membershipStatus)} />
      </View>
    ),
    [styles],
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>{'←'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Семья</Text>
        </View>
        <View style={styles.skeletonList}><Skeleton variant="card" /><Skeleton variant="card" /></View>
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
          <Text style={styles.headerTitle}>Семья</Text>
        </View>
        <ErrorState message="Не удалось загрузить данные" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>{'←'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Семья</Text>
      </View>

      <FlatList
        data={members ?? []}
        keyExtractor={(item) => item.id}
        renderItem={renderMember}
        contentContainerStyle={[styles.listContent, (members ?? []).length === 0 && styles.emptyContainer]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.accent.primary} />
        }
        ListEmptyComponent={
          <EmptyState icon="👨‍👩‍👧‍👦" title="Нет привязанных профилей" subtitle="Добавьте членов семьи для общего абонемента" />
        }
      />
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
  listContent: { paddingHorizontal: SPACING[4], paddingBottom: SPACING[6], gap: SPACING[3] },
  emptyContainer: { flex: 1 },
  memberCard: {
    flexDirection: 'row' as const, backgroundColor: t.colors.bg.elevated,
    borderRadius: t.radius.lg, padding: SPACING[4], gap: SPACING[3], alignItems: 'center' as const,
  },
  avatarCircle: {
    width: 48, height: 48, borderRadius: t.radius.full,
    backgroundColor: t.colors.accent.primary,
    alignItems: 'center' as const, justifyContent: 'center' as const,
  },
  avatarText: { ...t.typography.body, color: t.colors.text.inverse, fontWeight: '700' as const },
  memberInfo: { flex: 1, gap: SPACING[1] },
  memberName: { ...t.typography.body, color: t.colors.text.primary, fontWeight: '600' as const },
  memberRel: { ...t.typography.caption, color: t.colors.text.tertiary },
}));
