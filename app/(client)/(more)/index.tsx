import { View, Text, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Card, Button } from '@/shared/ui';
import { createStyles } from '@/shared/theme/createStyles';
import { useLogout } from '@/features/auth/useLogout';
import { useScreenView } from '@/features/analytics/tracker';
import { SPACING } from '@/shared/theme/types';

const menuItems = [
  { label: 'Счета', icon: '💳', route: '/(client)/(more)/billing' },
  { label: 'Мой тариф', icon: '🏅', route: '/(client)/(more)/membership' },
  { label: 'Купленные услуги', icon: '🛍️', route: '/(client)/(more)/purchases' },
  { label: 'Каталог', icon: '📦', route: '/(client)/(more)/catalog' },
  { label: 'Бонусы', icon: '💎', route: '/(client)/(more)/loyalty' },
  { label: 'Заморозка', icon: '❄️', route: '/(client)/(more)/freeze' },
  { label: 'Избранное', icon: '❤️', route: '/(client)/(more)/favorites' },
  { label: 'Статистика', icon: '📊', route: '/(client)/(more)/stats' },
  { label: 'Достижения', icon: '🏆', route: '/(client)/(more)/achievements' },
  { label: 'Тренировка', icon: '💪', route: '/(client)/(more)/workout' },
  { label: 'Отзывы', icon: '⭐', route: '/(client)/(more)/reviews' },
  { label: 'Противопоказания', icon: '🩺', route: '/(client)/(more)/contraindications' },
  { label: 'Семья', icon: '👨‍👩‍👧‍👦', route: '/(client)/(more)/family' },
  { label: 'Документы', icon: '📁', route: '/(client)/(more)/documents' },
  { label: 'Чаты', icon: '💬', route: '/(client)/(more)/chat-list' },
  { label: 'Сообщество', icon: '👥', route: '/(client)/(more)/community' },
  { label: 'Справочник', icon: '📖', route: '/(client)/(more)/directory' },
  { label: 'Сторис', icon: '📱', route: '/(client)/(more)/stories' },
  { label: 'Магазин', icon: '🛍', route: '/(client)/(more)/shop-product' },
  { label: 'Корзина', icon: '🛒', route: '/(client)/(more)/cart' },
  { label: 'План питания', icon: '🥗', route: '/(client)/(more)/nutrition-plan' },
  { label: 'Онлайн-тренировки', icon: '▶️', route: '/(client)/(more)/online-player' },
  { label: 'Мини-игра', icon: '🧩', route: '/(client)/(more)/brain-game' },
  { label: 'Профиль', icon: '👤', route: '/(client)/(more)/profile' },
  { label: 'Настройки', icon: '⚙️', route: '/(client)/(more)/settings' },
  { label: 'О клубе', icon: 'ℹ️', route: '/(client)/(more)/club' },
  { label: 'Поддержка', icon: '💬', route: '/(client)/(more)/support' },
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

  const handleMenuPress = (route: string) => {
    router.push(route as never);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Ещё</Text>

        <View style={styles.menu}>
          {menuItems.map((item) => (
            <Card key={item.label} onPress={() => handleMenuPress(item.route)} style={styles.menuItem}>
              <View style={styles.menuRow}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.chevron}>{'›'}</Text>
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

        <View style={styles.bottomPad} />
      </ScrollView>
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
  bottomPad: {
    height: SPACING[8],
  },
}));
