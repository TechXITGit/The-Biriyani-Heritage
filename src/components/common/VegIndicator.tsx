import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

interface VegIndicatorProps {
  isVeg: boolean;
  size?: number;
}

export const VegIndicator: React.FC<VegIndicatorProps> = ({ isVeg, size = 16 }) => {
  const color = isVeg ? Colors.vegGreen : Colors.nonVegRed;
  const innerDotSize = Math.round(size * 0.45);

  return (
    <View
      style={[
        styles.outerSquare,
        {
          width: size,
          height: size,
          borderColor: color,
        },
      ]}
    >
      <View
        style={[
          styles.innerCircle,
          {
            width: innerDotSize,
            height: innerDotSize,
            borderRadius: innerDotSize / 2,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  outerSquare: {
    borderWidth: 1.5,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  innerCircle: {},
});
