import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CategoryItem } from '@/data/categories';
import { CategoryId } from '@/types/menu';
import { Palette, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { useAppTheme } from '@/store/dietStore';

interface CategoryPillProps {
  category: CategoryItem;
  isSelected: boolean;
  onSelect: (id: CategoryId) => void;
  layout?: 'chip' | 'avatar';
}

export const CategoryPill: React.FC<CategoryPillProps> = ({
  category,
  isSelected,
  onSelect,
  layout = 'avatar',
}) => {
  const theme = useAppTheme();

  if (layout === 'chip') {
    return (
      <TouchableOpacity
        style={[
          styles.chipContainer,
          isSelected
            ? [styles.chipSelected, { backgroundColor: theme.primary, borderColor: theme.primary }]
            : styles.chipUnselected,
        ]}
        onPress={() => onSelect(category.id)}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons
          name={category.icon as any}
          size={16}
          color={isSelected ? '#FFFFFF' : theme.primary}
          style={{ marginRight: 6 }}
        />
        <Text
          style={[
            styles.chipText,
            isSelected ? styles.chipTextSelected : styles.chipTextUnselected,
          ]}
        >
          {category.name}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.avatarContainer}
      onPress={() => onSelect(category.id)}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.imageWrap,
          isSelected
            ? [styles.imageWrapSelected, { borderColor: theme.primary }]
            : styles.imageWrapUnselected,
        ]}
      >
        <Image
          source={{ uri: category.image }}
          style={styles.avatarImage}
          contentFit="cover"
        />
        {isSelected && (
          <View style={[styles.selectedGlow, { backgroundColor: theme.primary }]}>
            <MaterialCommunityIcons name="check" size={13} color="#FFFFFF" />
          </View>
        )}
      </View>
      <Text
        style={[
          styles.avatarText,
          isSelected && { color: theme.primary },
        ]}
        numberOfLines={1}
      >
        {category.name}
      </Text>
     
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Chip Layout
  chipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.pill,
    marginRight: 8,
    borderWidth: 1,
  },
  chipSelected: {
    ...Shadows.sm,
  },
  chipUnselected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#F0E5E9',
  },
  chipText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  chipTextUnselected: {
    color: Palette.charcoal,
  },

  // Avatar Layout
  avatarContainer: {
    alignItems: 'center',
    marginRight: 14,
    width: 68,
  },
  imageWrap: {
    width: 58,
    height: 58,
    borderRadius: 29,
    padding: 2,
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
    position: 'relative',
    ...Shadows.sm,
  },
  imageWrapSelected: {
    backgroundColor: '#FCE8F0',
  },
  imageWrapUnselected: {
    borderColor: '#F0E5E9',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 27,
  },
  selectedGlow: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  avatarText: {
    fontSize: 11,
    fontWeight: Typography.weights.bold,
    color: Palette.textPrimary,
    marginTop: 6,
    textAlign: 'center',
  },
  avatarSubtitle: {
    fontSize: 9,
    color: Palette.textSecondary,
    marginTop: 1,
    textAlign: 'center',
  },
});
