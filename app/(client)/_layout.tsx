import { Tabs } from 'expo-router';
import { useTheme } from '@/shared/theme/useTheme';
import { LAYOUT } from '@/shared/theme/types';
import { House, CalendarBlank, QrCode, ListChecks, DotsThreeOutline } from 'phosphor-react-native';

export default function ClientLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bg.primary,
          borderTopColor: colors.border.default,
          height: LAYOUT.tabBar.height + 34,
        },
        tabBarActiveTintColor: colors.accent.primary,
        tabBarInactiveTintColor: colors.text.tertiary,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Главная',
          tabBarIcon: ({ color, size }) => <House size={size} color={color} weight="fill" />,
        }}
      />
      <Tabs.Screen
        name="(booking)"
        options={{
          title: 'Запись',
          tabBarIcon: ({ color, size }) => <CalendarBlank size={size} color={color} weight="fill" />,
        }}
      />
      <Tabs.Screen
        name="(qr)"
        options={{
          title: 'QR',
          tabBarIcon: ({ color, size }) => <QrCode size={size} color={color} weight="fill" />,
        }}
      />
      <Tabs.Screen
        name="(schedule)"
        options={{
          title: 'Расписание',
          tabBarIcon: ({ color, size }) => <ListChecks size={size} color={color} weight="fill" />,
        }}
      />
      <Tabs.Screen
        name="(more)"
        options={{
          title: 'Ещё',
          tabBarIcon: ({ color, size }) => <DotsThreeOutline size={size} color={color} weight="fill" />,
        }}
      />
    </Tabs>
  );
}
