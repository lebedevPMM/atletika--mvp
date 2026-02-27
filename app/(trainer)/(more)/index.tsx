import { View, Text, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Card, Button } from '@/shared/ui';
import { createStyles } from '@/shared/theme/createStyles';
import { useLogout } from '@/features/auth/useLogout';
import { useScreenView } from '@/features/analytics/tracker';
import { SPACING } from '@/shared/theme/types';

const menuItems = [
  { label: 'Профиль', icon: '👤', route: '/(trainer)/(more)/profile-edit' },
  { label: 'Уведомления', icon: '🔔', route: '/(trainer)/(more)/notifications' },
  { label: 'Расписание смен', icon: '📅', route: null },
  { label: 'Предпочтения', icon: '⚙️', route: '/(trainer)/(more)/preferences' },
  { label: 'Финансы', icon: '💰', route: '/(trainer)/(more)/finance' },
  { label: 'Запросы', icon: '📩', route: '/(trainer)/(more)/requests' },
  { label: 'Чаты', icon: '💬', route: '/(trainer)/(more)/chats' },
  { label: 'Команда', icon: '👥', route: '/(trainer)/(more)/team' },
  { label: 'Задачи', icon: '✅', route: '/(trainer)/(more)/tasks' },
  { label: 'KPI', icon: '📊', route: '/(trainer)/(more)/kpi' },
  { label: 'Библиотека упражнений', icon: '📚', route: '/(trainer)/(more)/exercise-library' },
  { label: 'Детали лида', icon: '🎯', route: '/(trainer)/(more)/lead-details' },
  { label: 'Замена тренера', icon: '🔄', route: '/(trainer)/(more)/replacement' },
  { label: 'Детали зарплаты', icon: '💳', route: '/(trainer)/(more)/salary-detail' },
  { label: 'Оборудование', icon: '🔧', route: '/(trainer)/(more)/equipment-report' },
  { label: 'База знаний', icon: '📖', route: '/(trainer)/(more)/knowledge-base' },
  { label: 'Рассылка', icon: '📢', route: '/(trainer)/(more)/broadcast' },
  { label: 'Доступность', icon: '📅', route: '/(trainer)/(more)/availability' },
  { label: 'Оценка клиента', icon: '📋', route: '/(trainer)/(more)/client-assessment' },
  { label: 'Отпуск', icon: '🏖', route: '/(trainer)/(more)/vacation' },
  { label: 'Заметки', icon: '📝', route: '/(trainer)/(more)/client-notes' },
  { label: 'Сертификация', icon: '🎓', route: '/(trainer)/(more)/certification' },
  { label: 'История зарплат', icon: '📈', route: '/(trainer)/(more)/payroll-history' },
  { label: 'Сообщество тренеров', icon: '🤝', route: '/(trainer)/(more)/trainer-community' },
  { label: 'Обучение', icon: '🎓', route: '/(trainer)/(more)/education' },
  { label: 'О клубе', icon: 'ℹ️', route: null },
  { label: 'Поддержка', icon: '💬', route: null },
] as const;

export default function TrainerMoreScreen() {
  useScreenView('trainer_more');
  const router = useRouter();
  const logout = useLogout();
  const styles = useStyles();

  const handleMenuPress = (item: (typeof menuItems)[number]) => {
    if (item.route) {
      router.push(item.route as never);
    } else {
      Alert.alert('Функция в разработке', `"${item.label}" будет доступно в следующем обновлении`);
    }
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Ещё</Text>

        <View style={styles.menu}>
          {menuItems.map((item) => (
            <Card key={item.label} onPress={() => handleMenuPress(item)} style={styles.menuItem}>
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
