import { View, Text } from 'react-native';
import { createStyles } from '@/shared/theme/createStyles';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
  actionTitle?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, subtitle, actionTitle, onAction }: EmptyStateProps) {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {actionTitle && onAction && (
        <Button title={actionTitle} onPress={onAction} size="small" style={styles.button} />
      )}
    </View>
  );
}

const useStyles = createStyles((t) => ({
  container: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: 32,
    gap: 12,
  },
  icon: { fontSize: 48 },
  title: {
    ...t.typography.h3,
    color: t.colors.text.primary,
    textAlign: 'center' as const,
  },
  subtitle: {
    ...t.typography.body,
    color: t.colors.text.secondary,
    textAlign: 'center' as const,
  },
  button: { marginTop: 8 },
}));
