import { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Card } from '@/shared/ui';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { useScreenView } from '@/features/analytics/tracker';
import { mmkv } from '@/shared/lib/storage';
import { SPACING } from '@/shared/theme/types';

const STORAGE_KEY = 'notification_prefs';

interface NotificationPrefs {
  workoutReminders: boolean;
  billing: boolean;
  promotions: boolean;
  bonusProgram: boolean;
}

const DEFAULT_PREFS: NotificationPrefs = {
  workoutReminders: true,
  billing: true,
  promotions: false,
  bonusProgram: false,
};

function loadPrefs(): NotificationPrefs {
  const raw = mmkv.getString(STORAGE_KEY);
  if (!raw) return DEFAULT_PREFS;
  try {
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFS;
  }
}

function savePrefs(prefs: NotificationPrefs) {
  mmkv.set(STORAGE_KEY, JSON.stringify(prefs));
}

const toggleItems: { key: keyof NotificationPrefs; label: string }[] = [
  { key: 'workoutReminders', label: 'Напоминания о тренировках' },
  { key: 'billing', label: 'Счета и оплата' },
  { key: 'promotions', label: 'Акции и новости' },
  { key: 'bonusProgram', label: 'Бонусная программа' },
];

export default function NotificationSettingsScreen() {
  useScreenView('client_notification_settings');
  const styles = useStyles();
  const { colors } = useTheme();
  const router = useRouter();
  const [prefs, setPrefs] = useState<NotificationPrefs>(DEFAULT_PREFS);

  useEffect(() => {
    setPrefs(loadPrefs());
  }, []);

  const handleToggle = useCallback((key: keyof NotificationPrefs) => {
    setPrefs((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      savePrefs(next);
      return next;
    });
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.backButton}>{'<'} Назад</Text>
        </Pressable>
        <Text style={styles.title}>Уведомления</Text>
      </View>

      <View style={styles.content}>
        {toggleItems.map((item) => (
          <Card key={item.key} style={styles.toggleCard}>
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>{item.label}</Text>
              <Switch
                value={prefs[item.key]}
                onValueChange={() => handleToggle(item.key)}
                trackColor={{
                  false: colors.bg.sunken,
                  true: colors.accent.primary,
                }}
                thumbColor={colors.bg.elevated}
              />
            </View>
          </Card>
        ))}
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
    gap: SPACING[2],
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
  toggleLabel: {
    ...t.typography.body,
    color: t.colors.text.primary,
    flex: 1,
    marginRight: SPACING[3],
  },
}));
