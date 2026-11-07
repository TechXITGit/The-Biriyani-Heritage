import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Palette, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';

interface SearchBarProps {
  value?: string;
  onChangeText?: (text: string) => void;
  onSubmitEditing?: () => void;
  autoFocus?: boolean;
  isClickableOnly?: boolean; // if true, clicking navigates to /search
}

const placeholders = [
  'Search for Dum Biryani...',
  'Search for Galauti Kebabs...',
  'Search for Butter Chicken...',
  'Search for Paneer Tikka...',
  'Search your favourite royal dish...',
];

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onSubmitEditing,
  autoFocus = false,
  isClickableOnly = false,
}) => {
  const router = useRouter();
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (value && value.length > 0) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [value]);

  if (isClickableOnly) {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => router.push('/search' as any)}
        activeOpacity={0.85}
      >
        <Ionicons name="search" size={19} color={Palette.primary} style={styles.searchIcon} />
        <View style={styles.textContainer}>
          <Text style={styles.placeholderText} numberOfLines={1}>
            {placeholders[placeholderIndex]}
          </Text>
        </View>
        <View style={styles.divider} />
        <TouchableOpacity
          style={styles.micButton}
          onPress={() => router.push('/search' as any)}
        >
          <MaterialCommunityIcons name="microphone" size={19} color={Palette.charcoal} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, isFocused && styles.containerFocused]}>
      <Ionicons
        name="search"
        size={19}
        color={isFocused ? Palette.primary : Palette.charcoal}
        style={styles.searchIcon}
      />
      <TextInput
        style={styles.input}
        placeholder={placeholders[placeholderIndex]}
        placeholderTextColor={Palette.textSecondary}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoFocus={autoFocus}
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
      {value && value.length > 0 ? (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => onChangeText && onChangeText('')}
        >
          <Ionicons name="close-circle" size={18} color={Palette.textSecondary} />
        </TouchableOpacity>
      ) : (
        <>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.micButton}>
            <MaterialCommunityIcons name="microphone" size={19} color={Palette.charcoal} />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.md,
    height: 46,
    borderWidth: 1.2,
    borderColor: Palette.border, // Border #F0E5E9
    ...Shadows.sm,
  },
  containerFocused: {
    borderColor: Palette.primary, // Search bar focus state #E36B9A
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    color: Palette.textPrimary, // Text Primary #292832
    paddingVertical: 0,
    outlineStyle: 'none' as any,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: Typography.sizes.sm,
    color: Palette.textSecondary, // Text Secondary #85838B
  },
  divider: {
    width: 1,
    height: 18,
    backgroundColor: Palette.divider, // Divider #F3E9ED
    marginHorizontal: 8,
  },
  micButton: {
    padding: 4,
  },
  clearButton: {
    padding: 4,
  },
});
