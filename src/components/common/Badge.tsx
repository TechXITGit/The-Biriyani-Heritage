import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Palette, Typography, BorderRadius } from '@/constants/theme';

interface BadgeProps {
  type: 'bestseller' | 'chef' | 'spicy' | 'deal' | 'veg' | 'non-veg';
  text?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ type, text, size = 'sm' }) => {
  let bg: string = Palette.primarySoft;
  let fg: string = Palette.primary;
  let icon: any = 'star';
  let defaultText = 'Bestseller';

  if (type === 'bestseller') {
    bg = Palette.primarySoft; // #FCE8F0
    fg = Palette.primary; // #E36B9A
    icon = 'crown';
    defaultText = 'BESTSELLER';
  } else if (type === 'chef') {
    bg = Palette.primarySoft;
    fg = Palette.primaryDark; // #B94D79
    icon = 'chef-hat';
    defaultText = "CHEF'S SPECIAL";
  } else if (type === 'spicy') {
    bg = '#FFEBEE';
    fg = Palette.spicyRed;
    icon = 'chili-medium';
    defaultText = 'SPICY';
  } else if (type === 'deal') {
    bg = '#E8F5E9';
    fg = Palette.veg.indicator; // Preserved green
    icon = 'tag-outline';
    defaultText = 'SPECIAL COMBO';
  }

  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: bg },
        isSmall ? styles.containerSm : styles.containerMd,
      ]}
    >
      <MaterialCommunityIcons
        name={icon}
        size={isSmall ? 11 : 13}
        color={fg}
        style={{ marginRight: 3 }}
      />
      <Text
        style={[
          styles.text,
          { color: fg },
          isSmall ? styles.textSm : styles.textMd,
        ]}
      >
        {text || defaultText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  containerSm: {
    paddingHorizontal: 6,
    paddingVertical: 2.5,
  },
  containerMd: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  text: {
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.3,
  },
  textSm: {
    fontSize: 9.5,
  },
  textMd: {
    fontSize: 11,
  },
});
