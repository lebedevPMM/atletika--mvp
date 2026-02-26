import { View, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Button } from '@/shared/ui';
import { createStyles } from '@/shared/theme/createStyles';
import { useLogout } from '@/features/auth/useLogout';
import { useScreenView } from '@/features/analytics/tracker';

const menuItems = [
  { label: 'Профиль', icon: '👤' },
  { label: 'Настройки', icon: '⚙️' },
  { label: 'О клубе', icon: 'ℹ️' },
  { label: 'Поддержка', icon: '💬' },
] as const;

export default function MoreScreen() {
  useScreenView('client_more');
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Ещё</Text>

      <View style={styles.menu}>
        {menuItems.map((item) => (
          <Card key={item.label} onPress={() => {}} style={styles.menuItem}>
            <View style={styles.menuRow}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.chevron}>›</Text>
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
    paddingHorizontal: 16,
  },
  title: {
    fontFamily: t.typography.h2.fontFamily,
    fontWeight: t.typography.h2.fontWeight,
    fontSize: t.typography.h2.fontSize,
    lineHeight: t.typography.h2.lineHeight,
    color: t.colors.text.primary,
    marginTop: 16,
    marginBottom: 24,
  },
  menu: {
    gap: 8,
  },
  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  menuLabel: {
    flex: 1,
    fontFamily: t.typography.bodyLg.fontFamily,
    fontWeight: t.typography.bodyLg.fontWeight,
    fontSize: t.typography.bodyLg.fontSize,
    lineHeight: t.typography.bodyLg.lineHeight,
    color: t.colors.text.primary,
  },
  chevron: {
    fontSize: 20,
    color: t.colors.text.tertiary,
  },
  divider: {
    height: 1,
    backgroundColor: t.colors.border.default,
    marginVertical: 24,
  },
  logoutContainer: {
    paddingHorizontal: 0,
  },
}));
