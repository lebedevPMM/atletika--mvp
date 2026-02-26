import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Card } from '@/shared/ui';
import { createStyles } from '@/shared/theme/createStyles';
import { useScreenView } from '@/features/analytics/tracker';
import { SPACING } from '@/shared/theme/types';

const settingsItems = [
  { label: 'Уведомления', icon: '\uD83D\uDD14', route: '/(client)/(more)/settings/notifications' },
  { label: 'Конфиденциальность', icon: '\uD83D\uDD12', route: '/(client)/(more)/settings/privacy' },
  { label: 'О приложении', icon: '\u2139\uFE0F', route: '/(client)/(more)/settings/about' },
] as const;

export default function SettingsScreen() {
  useScreenView('client_settings');
  const styles = useStyles();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.backButton}>{'<'} Назад</Text>
        </Pressable>
        <Text style={styles.title}>Настройки</Text>
      </View>

      <View style={styles.menu}>
        {settingsItems.map((item) => (
          <Card
            key={item.label}
            onPress={() => router.push(item.route as never)}
            style={styles.menuItem}
          >
            <View style={styles.menuRow}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.chevron}>{'\u203A'}</Text>
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
  menu: {
    paddingHorizontal: SPACING[4],
    gap: SPACING[2],
  },
  menuItem: {
    paddingVertical: SPACING[3],
    paddingHorizontal: SPACING[4],
  },
  menuRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: SPACING[3],
  },
  menuLabel: {
    flex: 1,
    ...t.typography.bodyLg,
    color: t.colors.text.primary,
  },
  chevron: {
    fontSize: 20,
    color: t.colors.text.tertiary,
  },
}));
