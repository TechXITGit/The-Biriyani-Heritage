import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { useDietStore, useAppTheme } from '@/store/dietStore';
import { Colors, Typography, BorderRadius, Shadows } from '@/constants/theme';

interface VegToggleProps {
  compact?: boolean;
}

export const VegToggle: React.FC<VegToggleProps> = ({ compact = false }) => {
  const isVegOnly = useDietStore((state) => state.isVegOnly);
  const toggleVegOnly = useDietStore((state) => state.toggleVegOnly);
  const theme = useAppTheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isVegOnly ? styles.containerVeg : styles.containerNonVeg,
        compact && styles.containerCompact,
      ]}
      onPress={toggleVegOnly}
      activeOpacity={0.7}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      accessibilityLabel={`Toggle Veg filter, currently ${isVegOnly ? 'Veg' : 'Non-Veg'}`}
      accessibilityRole="switch"
      accessibilityState={{ checked: isVegOnly }}
    >
      {/* Veg / Non-Veg Indicator Symbol */}
      <View
        style={[
          styles.symbolBorder,
          {
            borderColor: isVegOnly ? '#0E7E38' : '#BA1A1A',
          },
        ]}
      >
        <View
          style={[
            styles.symbolDot,
            {
              backgroundColor: isVegOnly ? '#0E7E38' : '#BA1A1A',
            },
          ]}
        />
      </View>

      <Text
        style={[
          styles.label,
          isVegOnly ? styles.labelVeg : styles.labelNonVeg,
          compact && styles.labelCompact,
        ]}
        numberOfLines={1}
      >
        {isVegOnly ? 'VEG' : 'NON-VEG'}
      </Text>

      {/* Mini switch indicator dot */}
      <View
        style={[
          styles.switchTrack,
          isVegOnly ? styles.switchTrackVeg : styles.switchTrackNonVeg,
        ]}
      >
        <View
          style={[
            styles.switchThumb,
            isVegOnly ? styles.switchThumbVeg : styles.switchThumbNonVeg,
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.pill,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    gap: 7,
    flexShrink: 0,
    cursor: Platform.OS === 'web' ? ('pointer' as any) : undefined,
    ...Shadows.sm,
  },
  containerCompact: {
    height: 40,
    paddingHorizontal: 10,
    gap: 5,
  },
  containerNonVeg: {
    borderColor: '#F0E5E9',
    backgroundColor: '#FFFFFF',
  },
  containerVeg: {
    borderColor: '#0E7E38',
    backgroundColor: '#E8F8ED',
    ...Shadows.md,
  },
  symbolBorder: {
    width: 14,
    height: 14,
    borderWidth: 1.8,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  symbolDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: 12,
    fontWeight: Typography.weights.extraBold,
    letterSpacing: 0.3,
  },
  labelCompact: {
    fontSize: 11,
  },
  labelNonVeg: {
    color: '#363744',
  },
  labelVeg: {
    color: '#0A5D28',
  },
  switchTrack: {
    width: 26,
    height: 14,
    borderRadius: 7,
    padding: 2,
    justifyContent: 'center',
  },
  switchTrackNonVeg: {
    backgroundColor: '#E8DED1',
    alignItems: 'flex-start',
  },
  switchTrackVeg: {
    backgroundColor: '#0E7E38',
    alignItems: 'flex-end',
  },
  switchThumb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
      },
      android: { elevation: 1 },
    }),
  },
  switchThumbNonVeg: {},
  switchThumbVeg: {},
});
