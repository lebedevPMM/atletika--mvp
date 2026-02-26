import { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Card, Button } from '@/shared/ui';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { useScreenView } from '@/features/analytics/tracker';
import { mmkv } from '@/shared/lib/storage';
import { SPACING } from '@/shared/theme/types';

const ANALYTICS_KEY = 'privacy_analytics_enabled';

export default function PrivacySettingsScreen() {
  useScreenView('client_privacy_settings');
  const styles = useStyles();
  const { colors } = useTheme();
  const router = useRouter();
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  useEffect(() => {
    const stored = mmkv.getString(ANALYTICS_KEY);
    if (stored !== undefined) {
      try {
        setAnalyticsEnabled(JSON.parse(stored));
      } catch {
        // keep default
      }
    }
  }, []);

  const handleToggleAnalytics = useCallback(() => {
    setAnalyticsEnabled((prev) => {
      const next = !prev;
      mmkv.set(ANALYTICS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const handleExportData = () => {
    Alert.alert(
      'Экспорт данных',
      'Запрос отправлен. Данные будут готовы в течение 24 часов.',
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Удалить аккаунт',
      'Вы уверены? Все данные будут удалены безвозвратно.',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Запрос отправлен',
              'Аккаунт будет удален в течение 30 дней.',
            );
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.backButton}>{'<'} Назад</Text>
        </Pressable>
        <Text style={styles.title}>Конфиденциальность</Text>
      </View>

      <View style={styles.content}>
        {/* Info section */}
        <Card style={styles.infoCard}>
          <Text style={styles.infoText}>
            Ваши данные защищены согласно ФЗ-152
          </Text>
        </Card>

        {/* Analytics toggle */}
        <Card style={styles.toggleCard}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Аналитика</Text>
              <Text style={styles.toggleDescription}>
                Помогает нам улучшить приложение
              </Text>
            </View>
            <Switch
              value={analyticsEnabled}
              onValueChange={handleToggleAnalytics}
              trackColor={{
                false: colors.bg.sunken,
                true: colors.accent.primary,
              }}
              thumbColor={colors.bg.elevated}
            />
          </View>
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Экспорт данных"
            variant="secondary"
            onPress={handleExportData}
          />
          <Button
            title="Удалить аккаунт"
            variant="danger"
            onPress={handleDeleteAccount}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const useStyles = createStyles((t) => ({
  container: {
    flex: 1,
    backgroundColor: t.colors.bg.primary,
  },
  header: {
    paddingHorizontal: SPACING[4],
    paddingTop: SPACING[2],
    paddingBottom: SPACING[4],
  },
  backButton: {
    ...t.typography.body,
    color: t.colors.text.accent,
    marginBottom: SPACING[2],
  },
  title: {
    ...t.typography.h2,
    color: t.colors.text.primary,
  },
  content: {
    paddingHorizontal: SPACING[4],
    gap: SPACING[3],
  },
  infoCard: {
    paddingVertical: SPACING[4],
    paddingHorizontal: SPACING[4],
    backgroundColor: t.colors.bg.surface,
  },
  infoText: {
    ...t.typography.body,
    color: t.colors.text.secondary,
  },
  toggleCard: {
    paddingVertical: SPACING[3],
    paddingHorizontal: SPACING[4],
  },
  toggleRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  toggleInfo: {
    flex: 1,
    marginRight: SPACING[3],
  },
  toggleLabel: {
    ...t.typography.body,
    color: t.colors.text.primary,
  },
  toggleDescription: {
    ...t.typography.bodySm,
    color: t.colors.text.secondary,
    marginTop: SPACING['0.5'],
  },
  actions: {
    gap: SPACING[3],
    marginTop: SPACING[3],
  },
}));
