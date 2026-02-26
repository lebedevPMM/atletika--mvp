import { View, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Button } from '@/shared/ui';
import { createStyles } from '@/shared/theme/createStyles';
import { useLogout } from '@/features/auth/useLogout';
import { useScreenView } from '@/features/analytics/tracker';
import { SPACING } from '@/shared/theme/types';

const menuItems = [
  { label: 'Профиль', icon: '\uD83D\uDC64' },
  { label: 'Расписание смен', icon: '\uD83D\uDCC5' },
  { label: 'Настройки', icon: '\u2699\uFE0F' },
  { label: 'О клубе', icon: '\u2139\uFE0F' },
  { label: 'Поддержка', icon: '\uD83D\uDCAC' },
] as const;

export default function TrainerMoreScreen() {
  useScreenView('trainer_more');
  const logout = useLogout();
  const styles = useStyles();

  const handleMenuPress = (label: string) => {
    Alert.alert('Функция в разработке', `"${label}" будет доступно в следующем обновлении`);
  };

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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Ещё</Text>

      <View style={styles.menu}>
        {menuItems.map((item) => (
          <Card key={item.label} onPress={() => handleMenuPress(item.label)} style={styles.menuItem}>
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
