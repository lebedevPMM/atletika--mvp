import { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack } from 'expo-router';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { SPACING, LAYOUT } from '@/shared/theme/types';
import { useScreenView } from '@/features/analytics/tracker';
import { useTrainerClient } from '@/features/trainer/hooks';
import { Card, Badge, Button, Skeleton, SegmentedControl, ErrorState } from '@/shared/ui';
import { getInitials } from '@/features/profile/utils';

const TABS = ['Информация', 'Тренировки'];

function getMembershipBadgeVariant(status: string): 'success' | 'error' | 'warning' {
  switch (status) {
    case 'active': return 'success';
    case 'expired': return 'error';
    case 'frozen': return 'warning';
    default: return 'warning';
  }
}

function getMembershipLabel(status: string): string {
  switch (status) {
    case 'active': return 'Активен';
    case 'expired': return 'Истёк';
    case 'frozen': return 'Заморожен';
    default: return status;
  }
}

function formatLastVisit(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function TrainerClientProfileScreen() {
  useScreenView('trainer_client_profile');

  const { clientId } = useLocalSearchParams<{ clientId: string }>();
  const styles = useStyles();
  const { colors } = useTheme();

  const { data: client, isLoading, isError, refetch } = useTrainerClient(clientId ?? '');
  const [tabIndex, setTabIndex] = useState(0);

  const handleMessage = () => {
    Alert.alert('Функция в разработке', 'Написать клиенту можно будет в следующем обновлении');
  };

  const handleAssignSession = () => {
    Alert.alert('Функция в разработке', 'Назначение тренировки будет доступно в следующем обновлении');
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Stack.Screen options={{ headerShown: true, title: 'Загрузка...', headerBackTitle: 'Назад' }} />
        <View style={styles.content}>
          <Skeleton variant="card" />
          <Skeleton variant="list" />
          <Skeleton variant="list" />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !client) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Stack.Screen options={{ headerShown: true, title: 'Ошибка', headerBackTitle: 'Назад' }} />
        <ErrorState message="Не удалось загрузить профиль клиента" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  const fullName = `${client.firstName} ${client.lastName}`;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: fullName,
          headerBackTitle: 'Назад',
          headerStyle: { backgroundColor: colors.bg.primary },
          headerTintColor: colors.text.primary,
        }}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar + Name */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {getInitials(client.firstName, client.lastName)}
            </Text>
          </View>
          <Text style={styles.profileName}>{fullName}</Text>
          <Badge
            text={getMembershipLabel(client.membershipStatus)}
            variant={getMembershipBadgeVariant(client.membershipStatus)}
          />
        </View>

        {/* Info Cards */}
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Статус членства</Text>
            <Badge
              text={getMembershipLabel(client.membershipStatus)}
              variant={getMembershipBadgeVariant(client.membershipStatus)}
            />
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Телефон</Text>
            <Text style={styles.infoValue}>{client.phone}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Последний визит</Text>
            <Text style={styles.infoValue}>{formatLastVisit(client.lastVisit)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Проведено тренировок</Text>
            <Text style={styles.infoValue}>{client.sessionsCompleted}</Text>
          </View>
        </Card>

        {/* Current Plan */}
        <Card style={styles.planCard}>
          <Text style={styles.sectionTitle}>Текущий тариф</Text>
          <Text style={styles.planName}>
            {client.currentPlan ?? 'Нет плана'}
          </Text>
        </Card>

        {/* Tabs */}
        <SegmentedControl
          segments={TABS}
          selectedIndex={tabIndex}
          onSelect={setTabIndex}
        />

        {tabIndex === 0 ? (
          <Card style={styles.tabContent}>
            <Text style={styles.tabContentTitle}>Основная информация</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Имя</Text>
              <Text style={styles.infoValue}>{client.firstName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Фамилия</Text>
              <Text style={styles.infoValue}>{client.lastName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Телефон</Text>
              <Text style={styles.infoValue}>{client.phone}</Text>
            </View>
          </Card>
        ) : (
          <Card style={styles.tabContent}>
            <Text style={styles.placeholderText}>
              История тренировок будет доступна в следующем обновлении
            </Text>
          </Card>
        )}

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            title="Написать"
            variant="secondary"
            onPress={handleMessage}
          />
          <Button
            title="Назначить тренировку"
            variant="primary"
            onPress={handleAssignSession}
          />
        </View>
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
    padding: SPACING[4],
    gap: SPACING[4],
    paddingBottom: SPACING[10],
  },
  profileHeader: {
    alignItems: 'center' as const,
    gap: SPACING[3],
    paddingVertical: SPACING[2],
  },
  avatar: {
    width: LAYOUT.avatar.lg,
    height: LAYOUT.avatar.lg,
    borderRadius: LAYOUT.avatar.lg / 2,
    backgroundColor: t.colors.accent.surface,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  avatarText: {
    ...t.typography.h3,
    color: t.colors.accent.primary,
    fontWeight: '700' as const,
  },
  profileName: {
    ...t.typography.h3,
    color: t.colors.text.primary,
  },
  infoCard: {
    gap: SPACING[3],
  },
  infoRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  infoLabel: {
    ...t.typography.bodySm,
    color: t.colors.text.secondary,
  },
  infoValue: {
    ...t.typography.bodySm,
    color: t.colors.text.primary,
    fontWeight: '600' as const,
  },
  planCard: {
    gap: SPACING[2],
  },
  sectionTitle: {
    ...t.typography.h4,
    color: t.colors.text.primary,
  },
  planName: {
    ...t.typography.bodyLg,
    color: t.colors.text.primary,
    fontWeight: '600' as const,
  },
  tabContent: {
    gap: SPACING[3],
  },
  tabContentTitle: {
    ...t.typography.h4,
    color: t.colors.text.primary,
  },
  placeholderText: {
    ...t.typography.body,
    color: t.colors.text.secondary,
    textAlign: 'center' as const,
    paddingVertical: SPACING[6],
  },
  actions: {
    gap: SPACING[3],
    marginTop: SPACING[2],
  },
}));
