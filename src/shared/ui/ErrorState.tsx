import { View, Text } from 'react-native';
import { createStyles } from '@/shared/theme/createStyles';
import { Button } from './Button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = 'Что-то пошло не так',
  onRetry,
}: ErrorStateProps) {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <Button title="Повторить" onPress={onRetry} variant="secondary" size="small" />
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
  message: {
    ...t.typography.body,
    color: t.colors.text.secondary,
    textAlign: 'center' as const,
  },
}));
