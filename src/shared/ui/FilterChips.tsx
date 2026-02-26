import { ScrollView, Text, Pressable } from 'react-native';
import { createStyles } from '@/shared/theme/createStyles';
import { useTheme } from '@/shared/theme/useTheme';
import { useHaptic } from '@/shared/hooks/useHaptic';

interface Chip {
  label: string;
  value: string;
}

interface FilterChipsProps {
  chips: Chip[];
  selected: string | null;
  onSelect: (value: string | null) => void;
}

export function FilterChips({ chips, selected, onSelect }: FilterChipsProps) {
  const styles = useStyles();
  const { colors } = useTheme();
  const haptic = useHaptic();

  const handleSelect = (value: string) => {
    haptic.selection();
    onSelect(selected === value ? null : value);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {chips.map((chip) => {
        const isActive = chip.value === selected;
        return (
          <Pressable
            key={chip.value}
            onPress={() => handleSelect(chip.value)}
            style={[
              styles.chip,
              {
                borderColor: isActive ? colors.accent.primary : colors.border.default,
              },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                { color: isActive ? colors.accent.primary : colors.text.secondary },
              ]}
            >
              {chip.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const useStyles = createStyles((t) => ({
  container: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: t.radius.full,
    borderWidth: 1,
  },
  chipText: {
    ...t.typography.bodySm,
    fontWeight: '500' as const,
  },
}));
