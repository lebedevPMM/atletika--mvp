import { useState, useCallback, useMemo } from 'react';
import { View, Text, FlatList, RefreshControl, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { SPACING, LAYOUT } from '@/shared/theme/types';
import { useScreenView } from '@/features/analytics/tracker';
import { useTrainerClients } from '@/features/trainer/hooks';
import { getMembershipBadgeVariant, getMembershipLabel, formatLastVisit } from '@/features/trainer/utils';
import { Card, Badge, Input, EmptyState, Skeleton, ErrorState } from '@/shared/ui';
import { getInitials } from '@/features/profile/utils';
import type { TrainerClient } from '@/features/trainer/types';

export default function TrainerClientsScreen() {
  useScreenView('trainer_clients');

  const router = useRouter();
  const styles = useStyles();
  const { colors } = useTheme();
  const { data: clients, isLoading, isError, refetch } = useTrainerClients();
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const filteredClients = useMemo(() => {
    if (!clients) return [];
    if (!search.trim()) return clients;
    const query = search.toLowerCase().trim();
    return clients.filter((c) => {
      const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
      return fullName.includes(query);
    });
  }, [clients, search]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const renderClient = useCallback(({ item }: { item: TrainerClient }) => (
    <ClientCard client={item} onPress={() => router.push(`/(trainer)/(clients)/${item.id}`)} />
  ), [router]);

  const keyExtractor = useCallback((item: TrainerClient) => item.id, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Клиенты</Text>
        <Input
          placeholder="Поиск по имени..."
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {isError ? (
        <ErrorState message="Не удалось загрузить данные" onRetry={refetch} />
      ) : isLoading ? (
        <View style={styles.loadingContainer}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="list" />
          ))}
        </View>
      ) : (
        <FlatList
          data={filteredClients}
          renderItem={renderClient}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.accent.primary}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="👥"
              title={search ? 'Клиенты не найдены' : 'Нет клиентов'}
              subtitle={search ? 'Попробуйте изменить поисковый запрос' : 'Ваши клиенты появятся здесь'}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

function ClientCard({ client, onPress }: { client: TrainerClient; onPress: () => void }) {
  const styles = useStyles();

  return (
    <Card onPress={onPress} style={styles.clientCard}>
      <View style={styles.clientRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {getInitials(client.firstName, client.lastName)}
          </Text>
        </View>
        <View style={styles.clientInfo}>
          <View style={styles.clientNameRow}>
            <Text style={styles.clientName} numberOfLines={1}>
              {client.firstName} {client.lastName}
            </Text>
            <Badge
              text={getMembershipLabel(client.membershipStatus)}
              variant={getMembershipBadgeVariant(client.membershipStatus)}
            />
          </View>
          <Text style={styles.clientMeta}>
            Последний визит: {formatLastVisit(client.lastVisit)}
          </Text>
          <Text style={styles.clientMeta}>
            Тренировок: {client.sessionsCompleted}
            {client.currentPlan ? ` \u00B7 ${client.currentPlan}` : ''}
          </Text>
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
  header: {
    paddingHorizontal: SPACING[4],
    paddingTop: SPACING[4],
    paddingBottom: SPACING[3],
    gap: SPACING[3],
  },
  title: {
    ...t.typography.h2,
    color: t.colors.text.primary,
  },
  loadingContainer: {
    paddingHorizontal: SPACING[4],
    gap: SPACING[2],
  },
  listContent: {
    paddingHorizontal: SPACING[4],
    paddingBottom: SPACING[10],
  },
  separator: {
    height: SPACING[2],
  },
  clientCard: {
    padding: SPACING[3],
  },
  clientRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: SPACING[3],
  },
  avatar: {
    width: LAYOUT.avatar.md,
    height: LAYOUT.avatar.md,
    borderRadius: LAYOUT.avatar.md / 2,
    backgroundColor: t.colors.accent.surface,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  avatarText: {
    ...t.typography.bodySm,
    color: t.colors.accent.primary,
    fontWeight: '700' as const,
  },
  clientInfo: {
    flex: 1,
    gap: SPACING[1],
  },
  clientNameRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    gap: SPACING[2],
  },
  clientName: {
    ...t.typography.bodyLg,
    color: t.colors.text.primary,
    fontWeight: '600' as const,
    flex: 1,
  },
  clientMeta: {
    ...t.typography.caption,
    color: t.colors.text.secondary,
  },
}));
