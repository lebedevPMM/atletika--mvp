import { Tabs } from 'expo-router';
import { useTheme } from '@/shared/theme/useTheme';
import { LAYOUT } from '@/shared/theme/types';

export default function TrainerLayout() {
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
        options={{ title: 'Home' }}
      />
      <Tabs.Screen
        name="(schedule)"
        options={{ title: 'Schedule' }}
      />
      <Tabs.Screen
        name="(clients)"
        options={{ title: 'Clients' }}
      />
      <Tabs.Screen
        name="(more)"
        options={{ title: 'More' }}
      />
    </Tabs>
  );
}
