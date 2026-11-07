import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { heroBanners, BannerItem } from '@/data/banners';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_WIDTH = Math.min(SCREEN_WIDTH - 32, 420);

interface BannerCarouselProps {
  onBannerCtaPress?: (categoryTarget?: string) => void;
}

export const BannerCarousel: React.FC<BannerCarouselProps> = ({ onBannerCtaPress }) => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<any>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / (BANNER_WIDTH + 12));
    if (index !== activeIndex && index >= 0 && index < heroBanners.length) {
      setActiveIndex(index);
    }
  };

  const handlePress = (banner: BannerItem) => {
    if (onBannerCtaPress) {
      onBannerCtaPress(banner.categoryTarget);
    } else {
      router.push('/explore' as any);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled={false}
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={BANNER_WIDTH + 12}
        snapToAlignment="start"
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {heroBanners.map((banner, index) => (
          <TouchableOpacity
            key={banner.id}
            style={[
              styles.card,
              { backgroundColor: banner.bgColor },
            ]}
            onPress={() => handlePress(banner)}
            activeOpacity={0.92}
          >
            {/* Background Image / Food Showcase */}
            <Image
              source={{ uri: banner.image }}
              style={styles.cardBgImage}
              contentFit="cover"
            />
            {/* Subtle Gradient / Overlay */}
            <View style={styles.overlay} />

            {/* Left Content */}
            <View style={styles.contentWrap}>
              <View style={styles.badgeRow}>
                <View style={[styles.badge, { backgroundColor: banner.accentColor }]}>
                  <Text style={styles.badgeText}>{banner.badge}</Text>
                </View>
              </View>

              <Text style={styles.title} numberOfLines={2}>
                {banner.title}
              </Text>
              <Text style={styles.subtitle} numberOfLines={2}>
                {banner.subtitle}
              </Text>
              <Text style={styles.tagline} numberOfLines={1}>
                {banner.tagline}
              </Text>

              <View style={styles.ctaButton}>
                <Text style={styles.ctaText}>{banner.ctaText}</Text>
                <MaterialCommunityIcons
                  name="arrow-right"
                  size={14}
                  color={Colors.royalMaroon}
                />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {heroBanners.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === activeIndex ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 14,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    gap: 12,
  },
  card: {
    width: BANNER_WIDTH,
    height: 175,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    position: 'relative',
    ...Shadows.md,
  },
  cardBgImage: {
    position: 'absolute',
    right: -25,
    bottom: -15,
    width: 200,
    height: 200,
    opacity: 0.95,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(41, 42, 53, 0.45)',
  },
  contentWrap: {
    padding: 16,
    maxWidth: '68%',
    justifyContent: 'center',
    height: '100%',
  },
  badgeRow: {
    marginBottom: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: Typography.weights.extraBold,
    letterSpacing: 0.5,
  },
  title: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    lineHeight: 20,
    marginBottom: 4,
  },
  subtitle: {
    color: '#FCE8F0',
    fontSize: 11,
    lineHeight: 14,
    opacity: 0.95,
    marginBottom: 4,
  },
  tagline: {
    color: '#F5B4CC',
    fontSize: 9.5,
    fontWeight: Typography.weights.medium,
    marginBottom: 10,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E36B9A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    alignSelf: 'flex-start',
    gap: 4,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.2,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    gap: 5,
  },
  dot: {
    height: 4,
    borderRadius: 2,
  },
  activeDot: {
    width: 18,
    backgroundColor: '#E36B9A',
  },
  inactiveDot: {
    width: 6,
    backgroundColor: '#F0E5E9',
  },
});
