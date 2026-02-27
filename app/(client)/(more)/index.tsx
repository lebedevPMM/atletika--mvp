import { View, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Card, Button } from '@/shared/ui';
import { createStyles } from '@/shared/theme/createStyles';
import { useLogout } from '@/features/auth/useLogout';
import { useScreenView } from '@/features/analytics/tracker';
import { SPACING } from '@/shared/theme/types';

const menuItems = [
  { label: 'Счета', icon: '\uD83D\uDCB3', route: '/(client)/(more)/billing' },
  { label: 'Мой тариф', icon: '\uD83C\uDFC5', route: '/(client)/(more)/membership' },
  { label: 'Купленные услуги', icon: '\uD83D\uDECD\uFE0F', route: '/(client)/(more)/purchases' },
  { label: 'Каталог', icon: '\uD83D\uDCE6', route: '/(client)/(more)/catalog' },
  { label: 'Бонусы', icon: '\uD83D\uDC8E', route: '/(client)/(more)/loyalty' },
  { label: 'Заморозка', icon: '\u2744\uFE0F', route: '/(client)/(more)/freeze' },
  { label: 'Избранное', icon: '\u2764\uFE0F', route: '/(client)/(more)/favorites' },
  { label: 'Статистика', icon: '\uD83D\uDCCA', route: '/(client)/(more)/stats' },
  { label: 'Противопоказания', icon: '\uD83E\uDE7A', route: '/(client)/(more)/contraindications' },
  { label: 'Семья', icon: '\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC66', route: '/(client)/(more)/family' },
  { label: 'Документы', icon: '\uD83D\uDCC1', route: '/(client)/(more)/documents' },
  { label: 'Профиль', icon: '\uD83D\uDC64', route: '/(client)/(more)/profile' },
  { label: 'Настройки', icon: '\u2699\uFE0F', route: '/(client)/(more)/settings' },
  { label: 'О клубе', icon: '\u2139\uFE0F', route: '/(client)/(more)/club' },
  { label: 'Поддержка', icon: '\uD83D\uDCAC', route: '/(client)/(more)/support' },
] as const;

export default function MoreScreen() {
  useScreenView('client_more');
  const router = useRouter();
  const logout = useLogout();
  const styles = useStyles();

  const handleLogout = () => {
    Alert.alert(
      'Выйти из аккаунта?',
      'Вам нужно будет войти заново',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Выйти', style: 'destructive', onPress: logout },
      ],
    );
  };

  const handleMenuPress = (route: string | null) => {
    if (route) {
      router.push(route as never);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Ещё</Text>

      <View style={styles.menu}>
        {menuItems.map((item) => (
          <Card key={item.label} onPress={() => handleMenuPress(item.route)} style={styles.menuItem}>
            <View style={styles.menuRow}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.chevron}>{'\u203A'}</Text>
            </View>
          </Card>
        ))}
      </View>

      <View style={styles.divider} />

      <View style={styles.logoutContainer}>
        <Button
          title="Выйти"
          variant="danger"
          onPress={handleLogout}
        />
      </View>
    </SafeAreaView>
  );
}

const useStyles = createStyles((t) => ({
  container: {
    flex: 1,
    backgroundColor: t.colors.bg.primary,
    paddingHorizontal: SPACING[4],
  },
  title: {
    ...t.typography.h2,
    color: t.colors.text.primary,
    marginTop: SPACING[4],
    marginBottom: SPACING[6],
  },
  menu: {
    gap: SPACING[2],
  },
  menuItem: {
    paddingVertical: 14,
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
  divider: {
    height: 1,
    backgroundColor: t.colors.border.default,
    marginVertical: SPACING[6],
  },
  logoutContainer: {
    paddingHorizontal: 0,
  },
}));
