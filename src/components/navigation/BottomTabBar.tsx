import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { Palette, Typography, Shadows } from '@/constants/theme';
import { useCartStore } from '@/store/cartStore';
import { useAppTheme } from '@/store/dietStore';

interface TabItemConfig {
  name: string;
  route: string;
  iconActive: keyof typeof Ionicons.glyphMap;
  iconInactive: keyof typeof Ionicons.glyphMap;
  badge?: number;
}

interface AnimatedTabButtonProps {
  tab: TabItemConfig;
  isActive: boolean;
  onPress: () => void;
  activeColor: string;
}

const AnimatedTabButton: React.FC<AnimatedTabButtonProps> = ({
  tab,
  isActive,
  onPress,
  activeColor,
}) => {
  const activeProgress = useSharedValue(isActive ? 1 : 0);
  const iconScale = useSharedValue(1);

  useEffect(() => {
    if (isActive) {
      activeProgress.value = withSpring(1, { damping: 15, stiffness: 140 });
      iconScale.value = withSequence(
        withTiming(1.15, { duration: 130, easing: Easing.out(Easing.ease) }),
        withSpring(1, { damping: 12, stiffness: 130 })
      );
    } else {
      activeProgress.value = withTiming(0, {
        duration: 220,
        easing: Easing.inOut(Easing.ease),
      });
      iconScale.value = withTiming(1, { duration: 200 });
    }
  }, [isActive]);

  const pillAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: activeProgress.value }],
    opacity: activeProgress.value,
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const labelAnimatedStyle = useAnimatedStyle(() => ({
    opacity: 0.85 + activeProgress.value * 0.15,
  }));

  return (
    <TouchableOpacity
      style={styles.tabButton}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={tab.name}
    >
      <View style={styles.iconContainer}>
        {/* Animated Pink Expanding Pill/Circle Background */}
        <Animated.View
          style={[
            styles.activePillBackground,
            { backgroundColor: activeColor },
            pillAnimatedStyle,
          ]}
        />

        {/* Animated Icon (White when active, Charcoal #363744 when inactive) */}
        <Animated.View style={iconAnimatedStyle}>
          <Ionicons
            name={isActive ? tab.iconActive : tab.iconInactive}
            size={20}
            color={isActive ? '#FFFFFF' : Palette.charcoal}
          />
        </Animated.View>

        {/* Cart Count Badge */}
        {tab.badge && tab.badge > 0 ? (
          <View
            style={[
              styles.badge,
              {
                backgroundColor: isActive ? Palette.charcoal : activeColor,
              },
            ]}
          >
            <Text style={styles.badgeText}>{tab.badge}</Text>
          </View>
        ) : null}
      </View>

      {/* Label: Active color #E36B9A when selected, Text Secondary #85838B when inactive */}
      <Animated.Text
        style={[
          styles.tabLabel,
          isActive
            ? [styles.tabLabelActive, { color: activeColor }]
            : styles.tabLabelInactive,
          labelAnimatedStyle,
        ]}
      >
        {tab.name}
      </Animated.Text>
    </TouchableOpacity>
  );
};

export const BottomTabBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const cartCount = useCartStore((state) => state.getItemCount());
  const theme = useAppTheme();

  // Show bottom tab bar on the 4 root tab screens
  const isTabScreen =
    pathname === '/' ||
    pathname === '/explore' ||
    pathname === '/orders' ||
    pathname === '/profile';

  if (!isTabScreen) {
    return null;
  }

  const tabs: TabItemConfig[] = [
    {
      name: 'Home',
      route: '/',
      iconActive: 'home',
      iconInactive: 'home-outline',
    },
    {
      name: 'Menu',
      route: '/explore',
      iconActive: 'restaurant',
      iconInactive: 'restaurant-outline',
    },
    {
      name: 'Re-Order',
      route: '/orders',
      iconActive: 'repeat',
      iconInactive: 'repeat-outline',
    },
    {
      name: 'Profile',
      route: '/profile',
      iconActive: 'person',
      iconInactive: 'person-outline',
    },
  ];

  return (
    <View
      style={[
        styles.floatingWrapper,
        { bottom: Math.max(insets.bottom, 14) },
      ]}
      pointerEvents="box-none"
    >
      <View style={styles.capsule}>
        {tabs.map((tab) => {
          const isActive =
            tab.route === '/'
              ? pathname === '/'
              : pathname.startsWith(tab.route);

          return (
            <AnimatedTabButton
              key={tab.route}
              tab={tab}
              isActive={isActive}
              activeColor={theme.tabActive}
              onPress={() => {
                if (pathname !== tab.route) {
                  router.push(tab.route as any);
                }
              }}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingWrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    alignItems: 'center',
    zIndex: 9999,
    elevation: 12,
  },
  capsule: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30, // 30px rounded corners as specified
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    width: '100%',
    maxWidth: 480,
    borderWidth: 1,
    borderColor: '#F0E5E9', // Border #F0E5E9
    // Modern soft floating shadow
    ...Platform.select({
      ios: {
        shadowColor: '#363744',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
      default: {
        boxShadow: '0 6px 18px rgba(54, 55, 68, 0.1)',
      },
    }),
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingVertical: 4,
  },
  iconContainer: {
    width: 44,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activePillBackground: {
    position: 'absolute',
    width: 42,
    height: 30,
    borderRadius: 15,
  },
  tabLabel: {
    fontSize: 10,
    letterSpacing: 0.2,
    marginTop: 2,
  },
  tabLabelActive: {
    fontWeight: Typography.weights.bold,
  },
  tabLabelInactive: {
    color: '#85838B', // Inactive labels use #85838B
    fontWeight: Typography.weights.medium,
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: Typography.weights.extraBold,
  },
});
