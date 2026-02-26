import { View, Text, Pressable } from 'react-native';
import { createStyles } from '@/shared/theme/createStyles';
import { useHaptic } from '@/shared/hooks/useHaptic';

interface SegmentedControlProps {
  segments: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export function SegmentedControl({ segments, selectedIndex, onSelect }: SegmentedControlProps) {
  const styles = useStyles();
  const haptic = useHaptic();

  const handleSelect = (index: number) => {
    if (index === selectedIndex) return;
    haptic.selection();
    onSelect(index);
  };

  return (
    <View style={styles.container}>
      {segments.map((label, index) => {
        const isActive = index === selectedIndex;
        return (
          <Pressable
            key={label}
            onPress={() => handleSelect(index)}
            style={[styles.segment, isActive && styles.segmentActive]}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const useStyles = createStyles((t) => ({
  container: {
    flexDirection: 'row' as const,
    backgroundColor: t.colors.bg.surface,
    borderRadius: t.radius.lg,
    padding: 3,
  },
  segment: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 8,
    borderRadius: t.radius.md,
  },
  segmentActive: {
    backgroundColor: t.colors.accent.primary,
  },
  label: {
    ...t.typography.bodySm,
    color: t.colors.text.secondary,
    fontWeight: '500' as const,
  },
  labelActive: {
    color: t.colors.text.inverse,
    fontWeight: '600' as const,
  },
}));
