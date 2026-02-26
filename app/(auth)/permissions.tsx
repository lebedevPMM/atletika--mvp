import { useCallback } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button, Card } from '@/shared/ui';
import { useScreenView } from '@/features/analytics/tracker';
import { useHaptic } from '@/shared/hooks/useHaptic';
import { useTheme } from '@/shared/theme/useTheme';
import { createStyles } from '@/shared/theme/createStyles';
import { SPACING } from '@/shared/theme/types';
import { mmkv } from '@/shared/lib/storage';

export default function PermissionsScreen() {
  useScreenView('client_permissions');

  const router = useRouter();
  const styles = useStyles();
  const haptic = useHaptic();

  const handleAllowNotifications = useCallback(() => {
    haptic.success();
  }, [haptic]);

  const handleAllowCalendar = useCallback(() => {
    haptic.success();
  }, [haptic]);

  const handleContinue = useCallback(() => {
    router.replace('/(auth)/club-loading');
  }, [router]);

  const handleSkip = useCallback(() => {
    mmkv.set('permissions_skipped_at', Date.now().toString());
    router.replace('/(auth)/club-loading');
  }, [router]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Разрешения</Text>
          <Text style={styles.subtitle}>
            Для лучшего опыта разрешите доступ
          </Text>
        </View>

        <View style={styles.cards}>
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.icon}>🔔</Text>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>Уведомления</Text>
                <Text style={styles.cardDescription}>
                  Напомним о тренировке и сообщим об изменениях
                </Text>
              </View>
            </View>
            <Button
              title="Разрешить"
              onPress={handleAllowNotifications}
              variant="secondary"
              size="small"
              style={styles.allowBtn}
            />
          </Card>

          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.icon}>📅</Text>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>Календарь</Text>
                <Text style={styles.cardDescription}>
                  Автоматически добавим записи в ваш календарь
                </Text>
              </View>
            </View>
            <Button
              title="Разрешить"
              onPress={handleAllowCalendar}
              variant="secondary"
              size="small"
              style={styles.allowBtn}
            />
          </Card>
        </View>

        <View style={styles.bottom}>
          <Button
            title="Продолжить"
            onPress={handleContinue}
          />
          <Button
            title="Позже"
            onPress={handleSkip}
            variant="ghost"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const useStyles = createStyles((t) => ({
  safe: {
    flex: 1,
    backgroundColor: t.colors.bg.primary,
  },
  container: {
    flex: 1,
    paddingHorizontal: SPACING[4],
    paddingTop: SPACING[4],
  },
  header: {
    marginBottom: SPACING[8],
  },
  title: {
    ...t.typography.h2,
    color: t.colors.text.primary,
    marginBottom: SPACING[2],
  },
  subtitle: {
    ...t.typography.body,
    color: t.colors.text.secondary,
  },
  cards: {
    gap: SPACING[4],
    flex: 1,
  },
  card: {
    gap: SPACING[3],
  },
  cardHeader: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    gap: SPACING[3],
  },
  icon: {
    fontSize: 28,
    lineHeight: 34,
  },
  cardText: {
    flex: 1,
    gap: SPACING[1],
  },
  cardTitle: {
    ...t.typography.bodyLg,
    fontWeight: '700' as const,
    color: t.colors.text.primary,
  },
  cardDescription: {
    ...t.typography.bodySm,
    color: t.colors.text.secondary,
  },
  allowBtn: {
    alignSelf: 'flex-start' as const,
  },
  bottom: {
    paddingVertical: SPACING[4],
    gap: SPACING[2],
  },
}));
