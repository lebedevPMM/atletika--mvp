import { View, Text } from 'react-native';
import { createStyles } from '@/shared/theme/createStyles';

interface ComingSoonProps {
  icon?: string;
  title?: string;
  description?: string;
}

export function ComingSoon({
  icon = '🚧',
  title = 'Coming soon',
  description = 'This section is under development',
}: ComingSoonProps) {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const useStyles = createStyles((t) => ({
  container: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: t.colors.bg.primary,
    padding: 32,
    gap: 12,
  },
  icon: { fontSize: 64 },
  title: {
    ...t.typography.h2,
    color: t.colors.text.primary,
    textAlign: 'center' as const,
  },
  description: {
    ...t.typography.body,
    color: t.colors.text.secondary,
    textAlign: 'center' as const,
  },
}));
